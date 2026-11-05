# Month-Ahead Spending Forecast

A Python forecasting module for the Personal Finance Management app. It reads
the app's own finance records and forecasts **next month's spending** — overall
and per category — from the monthly trend.

## How it works

1. **Group** expense records into monthly totals per category. The record
   title (`Rent`, `Groceries`, …) is the category, matching the app's
   `FinanceRecord` model.
2. **Fit** a least-squares linear trend to each category's monthly totals
   (3+ months of history) and extrapolate one month ahead.
3. **Fall back** to a plain average when a category has only 1–2 months of
   history — no trend is invented from two points.
4. **Clamp** at zero: spending can't be negative.
5. **Report the method** per category, so the number is never presented as
   more certain than it is. Income is excluded — this forecasts spending.

Standard library only. No numpy, no scikit-learn, no services to run.

## Run it

```bash
cd forecast

# Demo (synthetic data, 6 months)
python3 forecast.py --demo

# Your own records (JSON export of the app's finance records)
python3 forecast.py records.json

# Live, straight from the app's MongoDB (needs pymongo: pip install pymongo)
python3 forecast.py --mongodb-uri "$MONGODB_URI"
```

Example output (`--demo`):

```json
{
  "next_month": "2026-11",
  "total_forecast": 2320.5,
  "by_category": [
    {"category": "Groceries", "forecast": 424.0, "next_month": "2026-11",
     "months_of_history": 6, "last_month_total": 410.0,
     "method": "linear trend over 6 months"},
    ...
  ],
  "note": "Trend estimate from the user's own ledger. ..."
}
```

## Tests

```bash
cd forecast
python3 -m unittest test_forecast -v
```

Covers: rising series forecasts above last month, flat series stays flat,
1–2 month fallback to average, income excluded, empty input, malformed rows
skipped, forecast never negative.

## Wiring it into the MERN app

The simplest honest integration, in order of effort:

1. **Export → forecast** (no code changes): export the user's finance
   records as JSON from MongoDB and run `forecast.py records.json`.
2. **Backend endpoint** (small change): add `GET /api/forecast` in
   `backend/src/routes/Finance.js` that loads the user's records, runs
   this module as a subprocess, and returns its JSON to the dashboard.
3. **Dashboard card**: show "Next month, you are trending to spend
   $X" with the per-category breakdown on the dashboard.

## Limits (stated on purpose)

- A trend needs history: under 3 months per category it is an average.
- One unusual month (a car repair, a holiday) moves the trend — the
  output says this in its note.
- It forecasts the categories already in the ledger; it can't predict a
  brand-new expense type.
