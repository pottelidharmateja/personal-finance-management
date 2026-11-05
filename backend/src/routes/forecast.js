/**
 * GET /api/forecast — month-ahead spending forecast for the logged-in user.
 *
 * Flow: load the user's finance records from MongoDB -> hand them to the
 * Python forecasting module (forecast/forecast.py, standard library only)
 * over stdin -> return its JSON.
 *
 * Why a subprocess instead of reimplementing the math in JS: the forecast
 * is one tested Python module (see forecast/test_forecast.py). Calling it
 * keeps a single source of truth for the math instead of two copies that
 * can drift apart.
 *
 * Why spawn() instead of execFile(): execFile's `input` option does not
 * reliably deliver stdin in this Node version — the Python process waits
 * on stdin forever and the call times out. spawn() with an explicit
 * stdin.end() works. (Caught by backend/test/forecast.test.js.)
 *
 * Auth: same JWT pattern as Finance.js — `Authorization: Bearer <token>`,
 * verified against JWT_SECRET, user id at req.user.userId.
 *
 * Responses:
 *   200  the forecast JSON: { next_month, total_forecast, by_category[], note }
 *   401  missing / invalid token
 *   503  python3 is not available on the server
 *   504  the forecast took longer than FORECAST_TIMEOUT_MS
 *   500  the forecast failed (details logged server-side, not leaked)
 */

import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import FinanceRecord from '../models/FinanceRecord.js';

const router = express.Router();

const FORECAST_TIMEOUT_MS = 10_000;

// forecast.py lives at the repo root: <repo>/forecast/forecast.py
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FORECAST_SCRIPT = path.resolve(__dirname, '../../../forecast/forecast.py');

// Middleware to authenticate user (same pattern as Finance.js)
const authenticate = (req, res, next) => {
  const header = req.header('Authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
  try {
    const decoded = jwt.verify(header.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded; // { userId, email }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * Run the Python forecast module, feeding records on stdin.
 * Resolves with the parsed JSON output.
 * Rejects with an error whose `code` is 'ENOENT' (python3 missing),
 * 'ETIMEOUT' (took too long), or 'EFORECAST' (non-zero exit / bad output).
 */
function runForecast(records) {
  return new Promise((resolve, reject) => {
    const child = spawn('python3', [FORECAST_SCRIPT, '-']);
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
    }, FORECAST_TIMEOUT_MS);

    child.stdout.on('data', (d) => {
      stdout += d;
    });
    child.stderr.on('data', (d) => {
      stderr += d;
    });
    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err); // ENOENT when python3 is not installed
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (timedOut) {
        const err = new Error('Forecast timed out');
        err.code = 'ETIMEOUT';
        reject(err);
      } else if (code !== 0) {
        console.error('Forecast: python exited non-zero:', stderr.trim());
        const err = new Error('Forecast failed');
        err.code = 'EFORECAST';
        reject(err);
      } else {
        try {
          resolve(JSON.parse(stdout));
        } catch (e) {
          console.error('Forecast: could not parse python output');
          const err = new Error('Forecast failed');
          err.code = 'EFORECAST';
          reject(err);
        }
      }
    });

    // If the child dies early, writing to stdin raises EPIPE — swallow it;
    // the 'close' handler above reports the real failure.
    child.stdin.on('error', () => {});
    child.stdin.end(JSON.stringify(records));
  });
}

router.get('/', authenticate, async (req, res) => {
  let records;
  try {
    records = await FinanceRecord.find({ userId: req.user.userId }).lean();
  } catch (error) {
    console.error('Forecast: failed to load records:', error.message);
    return res.status(500).json({ error: 'Failed to load finance records' });
  }

  const payload = records.map((r) => ({
    title: r.title,
    amount: r.amount,
    type: r.type,
    date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : r.date,
  }));

  try {
    const forecast = await runForecast(payload);
    res.json({ ...forecast, generated_at: new Date().toISOString() });
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('Forecast: python3 not found on this server');
      return res.status(503).json({ error: 'Forecast service unavailable on this server' });
    }
    if (error.code === 'ETIMEOUT') {
      return res.status(504).json({ error: 'Forecast timed out' });
    }
    return res.status(500).json({ error: 'Forecast failed' });
  }
});

export default router;
