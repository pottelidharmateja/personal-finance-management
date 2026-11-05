# Personal Finance Management

> A full-stack MERN app that turns messy monthly spending into a clear picture: what came in, what went out, and where it went — with JWT-secured accounts, a MongoDB-backed ledger, and Chart.js dashboards.

**Live demo:** _(add your deployed URL here once hosted)_
**Stack:** React 18 · Node.js / Express · MongoDB (Mongoose) · JWT · Chart.js · Bootstrap · Python forecasting · Mocha / Chai / Supertest · GitHub Actions

---

## What it does

- **Secure accounts** — signup and login with bcrypt-hashed passwords and JWT-protected routes. Every page behind login is guarded by a protected route.
- **Income & expense ledger** — add income and expense records (title, amount, date) and see them as a transaction history. Records are stored per user in MongoDB.
- **Dashboard that explains your month** — enter monthly income and expenses (rent, groceries, food, Wi-Fi, electricity, credit) and instantly see:
  - an expense breakdown pie chart,
  - an income vs. savings vs. expenses chart,
  - your remaining balance.
- **Transaction tracking** — every record with date, title, and amount, filterable by type (income / expense).
- **Month-ahead spending forecast** — a Python module (`forecast/`) reads the app's own ledger and forecasts next month's spending, overall and per category, from the monthly trend: least-squares linear trend with 3+ months of history, plain-average fallback with less, clamped at zero, with the method reported per category. Standard library only, tested (`python3 -m unittest test_forecast -v`). Run it with `python3 forecast/forecast.py --demo`.
- **Forecast in the product, not just in a script** — `GET /api/forecast` (JWT-protected, in `backend/src/routes/forecast.js`) serves the Python forecast for the logged-in user, and a `ForecastCard` component on the dashboard shows "Next month, you're trending to spend $X" with the per-category breakdown. Backend tests in `backend/test/forecast.test.js`.
- **Categories, Cash Flow, Investments, Settings** — navigation and pages for the full finance workflow.

## How it works

```
React frontend (port 3000) ──REST / JSON──> Express API (port 5500) ──Mongoose──> MongoDB Atlas
        │                                        │
        ├── JWT in Authorization header           ├── bcrypt password hashing
        ├── Chart.js dashboards                   ├── JWT verification middleware
        └── Protected routes                      └── Per-user finance records
```

**API endpoints**

| Method | Endpoint | Auth | What it does |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Create an account |
| POST | `/api/auth/login` | — | Log in, receive a JWT |
| GET | `/api/user/profile` | JWT | Current user profile |
| GET | `/api/finance/records` | JWT | List the user's finance records |
| POST | `/api/finance/records` | JWT | Add an income / expense record |
| POST | `/api/user-inputs/save-inputs` | — | Save monthly budget inputs |
| GET | `/api/user-inputs/get-inputs/:userId` | — | Load saved monthly inputs |

**Data model** — `FinanceRecord`: `userId`, `title`, `amount`, `type` (`income` | `expense`), `date`.

## Run it locally

```bash
# 1. Backend
cd backend
npm install
# create backend/.env with: MONGODB_URI, PORT=5500, JWT_SECRET
npm start          # or: node server.js

# 2. Frontend (new terminal)
cd frontend
npm install
npm start          # opens http://localhost:3000
```

Tests use an in-memory MongoDB, so no Atlas connection is needed to run them:

```bash
cd backend
NODE_ENV=test npm test
```

## Quality

- **Automated tests** — Mocha / Chai / Supertest covering signup, login, and finance-record flows, running against an in-memory MongoDB (`mongodb-memory-server`).
- **CI** — GitHub Actions runs the backend test suite on every push and pull request to `sprint_2` / `main`.
- **Security basics** — passwords are bcrypt-hashed, routes are JWT-protected, and secrets live in `.env`, never in code.

## What's next

- Finishing the Cash Flow and Investments pages with real data instead of placeholders.
- A hosted demo link and screenshots.

## Author

**Dharmateja Potteli** — ML Data Engineer @ Cigna · MS Computer Science, Saint Louis University (2025)
[LinkedIn](https://www.linkedin.com/in/poteli-dharma-teja/) · Saint Louis, MO
