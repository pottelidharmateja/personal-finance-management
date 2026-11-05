"""Tests for forecast.py — run with: python3 -m unittest test_forecast -v"""

import unittest

from forecast import forecast_next_month


def _record(title, amount, month, year=2026, kind="expense"):
    return {
        "title": title,
        "amount": amount,
        "type": kind,
        "date": f"{year}-{month:02d}-10",
    }


class TestForecast(unittest.TestCase):
    def test_rising_series_forecasts_above_last_month(self):
        # Groceries climbing 300 -> 350 -> 400: trend must point up.
        records = [
            _record("Groceries", 300, 5),
            _record("Groceries", 350, 6),
            _record("Groceries", 400, 7),
        ]
        out = forecast_next_month(records)
        self.assertEqual(out["next_month"], "2026-08")
        cat = out["by_category"][0]
        self.assertEqual(cat["category"], "Groceries")
        self.assertGreater(cat["forecast"], 400)
        self.assertIn("linear trend", cat["method"])

    def test_flat_series_forecasts_flat(self):
        records = [_record("Rent", 1200, m) for m in (5, 6, 7)]
        out = forecast_next_month(records)
        self.assertAlmostEqual(out["by_category"][0]["forecast"], 1200, places=1)

    def test_two_months_falls_back_to_average(self):
        records = [_record("Food", 100, 5), _record("Food", 200, 6)]
        out = forecast_next_month(records)
        cat = out["by_category"][0]
        self.assertAlmostEqual(cat["forecast"], 150, places=2)
        self.assertIn("average", cat["method"])

    def test_income_is_excluded(self):
        records = [
            _record("Salary", 4500, 5, kind="income"),
            _record("Salary", 4500, 6, kind="income"),
            _record("Salary", 4500, 7, kind="income"),
            _record("Rent", 1200, 5),
            _record("Rent", 1200, 6),
            _record("Rent", 1200, 7),
        ]
        out = forecast_next_month(records)
        self.assertEqual(len(out["by_category"]), 1)
        self.assertAlmostEqual(out["total_forecast"], 1200, places=1)

    def test_empty_records(self):
        out = forecast_next_month([])
        self.assertIsNone(out["next_month"])
        self.assertEqual(out["by_category"], [])

    def test_malformed_rows_are_skipped(self):
        records = [
            _record("Rent", 1200, 5),
            _record("Rent", 1200, 6),
            _record("Rent", 1200, 7),
            {"title": "Rent", "amount": "not-a-number", "type": "expense", "date": "2026-08-01"},
            {"title": "Rent", "type": "expense", "date": "2026-08-01"},
        ]
        out = forecast_next_month(records)
        self.assertAlmostEqual(out["total_forecast"], 1200, places=1)

    def test_forecast_never_negative(self):
        # Spending collapsing to zero: the trend would go negative, clamp it.
        records = [
            _record("Credit", 300, 5),
            _record("Credit", 150, 6),
            _record("Credit", 10, 7),
        ]
        out = forecast_next_month(records)
        self.assertGreaterEqual(out["by_category"][0]["forecast"], 0)


if __name__ == "__main__":
    unittest.main()
