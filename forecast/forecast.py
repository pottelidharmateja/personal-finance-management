"""
Month-ahead spending forecast for the Personal Finance Management app.

Reads the app's own finance records (income / expense, one row per
transaction) and forecasts next month's spending — overall and per
category — from the monthly trend.

Method (deliberately simple and honest):
  * Records are grouped into monthly totals per category (the record
    title — e.g. "Rent", "Groceries" — is the category, matching the
    app's FinanceRecord model, which has no separate category field).
  * With 3+ months of history for a category, a least-squares linear
    trend is fitted to the monthly totals and extrapolated one month
    ahead. This is ordinary least squares, standard library only.
  * With 1-2 months of history, the forecast falls back to the average
    of the months available — no trend is invented from two points.
  * Forecasts are clamped at zero: spending cannot be negative.
  * The output says which method was used per category, so the number
    is never presented as more certain than it is.

This is a trend estimate, not a guarantee: a single unusual month
(a car repair, a holiday) moves the trend, and the forecast says so.

Usage:
    python3 forecast.py --demo                 # synthetic demo data
    python3 forecast.py records.json           # your own JSON export
    python3 forecast.py - < records.json       # JSON records on stdin
                                                # (used by the Express /api/forecast endpoint)
    python3 forecast.py --mongodb-uri "$MONGODB_URI"
                                                # read live records (needs pymongo)

Records JSON format — a list of objects:
    [{"title": "Groceries", "amount": 342.50,
      "type": "expense", "date": "2026-08-04"}, ...]
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from datetime import date
from typing import Any

MIN_MONTHS_FOR_TREND = 3


def _month_key(d: date) -> str:
    return f"{d.year:04d}-{d.month:02d}"


def _parse_date(value: str) -> date:
    # date.fromisoformat handles "2026-08-04" and "2026-08-04T00:00:00"
    return date.fromisoformat(value[:10])


def _next_month(year: int, month: int) -> tuple[int, int]:
    if month == 12:
        return year + 1, 1
    return year, month + 1


def monthly_series(records: list[dict[str, Any]]) -> dict[str, dict[str, float]]:
    """Group expense records into {category: {YYYY-MM: total}}.

    Income records are excluded: this forecasts spending. Titles are
    normalised (trimmed, title-cased) so "groceries" and "Groceries"
    count as one category.
    """
    series: dict[str, dict[str, float]] = defaultdict(lambda: defaultdict(float))
    for r in records:
        if r.get("type") != "expense":
            continue
        try:
            amount = float(r["amount"])
            when = _parse_date(str(r["date"]))
        except (KeyError, TypeError, ValueError):
            continue  # skip malformed rows rather than crashing the forecast
        category = str(r.get("title", "Other")).strip().title() or "Other"
        series[category][_month_key(when)] += amount
    return {cat: dict(months) for cat, months in series.items()}


def _least_squares_trend(xs: list[float], ys: list[float]) -> tuple[float, float]:
    """Return (slope, intercept) of the least-squares line through (xs, ys)."""
    n = len(xs)
    mean_x = sum(xs) / n
    mean_y = sum(ys) / n
    denom = sum((x - mean_x) ** 2 for x in xs)
    if denom == 0:
        return 0.0, mean_y
    slope = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys)) / denom
    return slope, mean_y - slope * mean_x


def _forecast_one_category(month_totals: dict[str, float]) -> dict[str, Any]:
    """Forecast next month for one category from its monthly totals."""
    months = sorted(month_totals)  # YYYY-MM strings sort chronologically
    totals = [month_totals[m] for m in months]
    last_year, last_month = int(months[-1][:4]), int(months[-1][5:7])
    ny, nm = _next_month(last_year, last_month)

    if len(months) >= MIN_MONTHS_FOR_TREND:
        xs = list(range(len(months)))
        slope, intercept = _least_squares_trend(xs, totals)
        forecast = slope * len(months) + intercept
        method = f"linear trend over {len(months)} months"
    else:
        forecast = sum(totals) / len(totals)
        method = f"average of {len(months)} month(s) — too little history for a trend"

    return {
        "category": None,  # filled in by caller
        "forecast": round(max(forecast, 0.0), 2),
        "next_month": f"{ny:04d}-{nm:02d}",
        "months_of_history": len(months),
        "last_month_total": round(totals[-1], 2),
        "method": method,
    }


def forecast_next_month(records: list[dict[str, Any]]) -> dict[str, Any]:
    """Forecast next month's spending from finance records.

    Returns overall and per-category forecasts, plus the method used
    for each, so the result is auditable.
    """
    series = monthly_series(records)
    if not series:
        return {
            "next_month": None,
            "total_forecast": 0.0,
            "by_category": [],
            "note": "No expense records found — nothing to forecast.",
        }

    by_category = []
    for category in sorted(series):
        item = _forecast_one_category(series[category])
        item["category"] = category
        by_category.append(item)

    next_month = by_category[0]["next_month"]
    return {
        "next_month": next_month,
        "total_forecast": round(sum(c["forecast"] for c in by_category), 2),
        "by_category": by_category,
        "note": (
            "Trend estimate from the user's own ledger. "
            "Categories with under 3 months of history use a plain average. "
            "Not a guarantee — one unusual month moves the trend."
        ),
    }


def load_records_from_mongo(uri: str) -> list[dict[str, Any]]:
    """Read finance records from MongoDB (same DB the Express API uses)."""
    try:
        from pymongo import MongoClient  # type: ignore
    except ImportError as exc:
        raise SystemExit(
            "pymongo is not installed. Run: pip install pymongo"
        ) from exc
    client = MongoClient(uri)
    db = client.get_default_database()
    docs = db.financerecords.find({}, {"title": 1, "amount": 1, "type": 1, "date": 1})
    records = []
    for d in docs:
        when = d["date"]
        if hasattr(when, "date"):  # datetime -> date
            when = when.date()
        records.append(
            {
                "title": d.get("title"),
                "amount": d.get("amount"),
                "type": d.get("type"),
                "date": when.isoformat(),
            }
        )
    return records


def _demo_records() -> list[dict[str, Any]]:
    with open("demo_data.json", encoding="utf-8") as f:
        return json.load(f)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Forecast next month's spending.")
    parser.add_argument("records_file", nargs="?", help="JSON file of finance records")
    parser.add_argument("--demo", action="store_true", help="use synthetic demo data")
    parser.add_argument("--mongodb-uri", help="read live records from MongoDB")
    args = parser.parse_args(argv)

    if args.demo:
        records = _demo_records()
    elif args.mongodb_uri:
        records = load_records_from_mongo(args.mongodb_uri)
    elif args.records_file == "-":
        records = json.load(sys.stdin)
    elif args.records_file:
        with open(args.records_file, encoding="utf-8") as f:
            records = json.load(f)
    else:
        parser.error("give a records file, --demo, or --mongodb-uri")

    print(json.dumps(forecast_next_month(records), indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
