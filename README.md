# Stock Tracker — Full Stack (API + UI)

Monorepo containing:
- **stock-tracker-api** — Spring Boot (Java 21, Gradle), H2 by default, optional PostgreSQL
- **stock-tracker-ui** — Next.js 14 + Tailwind

## Quick Start (Dev)

### Prereqs
- Java 21
- Node.js 18+ (LTS recommended)

### 1) Start API (H2 in-memory)
```bash
cd stock-tracker/stock-tracker-api
./gradlew bootRun
# API at http://localhost:8080/api
# Health check: http://localhost:8080/api/health
```

The API seeds:
- Portfolio `actual` with AAPL (NASDAQ) & INFY (NSE)
- Portfolio `hypothetical` empty

Test endpoints:
```
GET  http://localhost:8080/api/portfolios/actual
GET  http://localhost:8080/api/stocks/us/AAPL
GET  http://localhost:8080/api/stocks/india/INFY
POST http://localhost:8080/api/portfolios/move-to-hypothetical
Body: { "symbol": "AAPL", "exchange": "NASDAQ" }
```

### 2) Start UI
Open a new terminal:
```bash
cd stock-tracker/stock-tracker-ui
cp .env.local.example .env.local
npm install
npm run dev
# UI at http://localhost:3000
```

The UI is preconfigured to call `http://localhost:8080/api` (CORS allowed).

---

## Use PostgreSQL (optional)

Provide DB env vars and include postgres profile config:
```bash
cd stock-tracker/stock-tracker-api
DB_URL=jdbc:postgresql://localhost:5432/stocktracker DB_USER=postgres DB_PASS=postgres SPRING_CONFIG_NAME=application,application-postgres ./gradlew bootRun
```

Create DB manually before running:
```sql
CREATE DATABASE stocktracker;
```

---

## Project Layout

```
stock-tracker/
├─ stock-tracker-api/            # Spring Boot backend
└─ stock-tracker-ui/             # Next.js frontend
```

API routes used by UI:
- `GET /api/stocks/{region}/{symbol}`
- `GET /api/portfolios/actual`
- `GET /api/portfolios/hypothetical`
- `POST /api/portfolios/move-to-hypothetical`

---

## Notes & Next Steps

- Market providers are **stubbed** (US/India). Replace with real calls (IEX, Alpha Vantage, Finnhub).
- Add `POST /portfolios/positions` to create new positions.
- Add auth if needed (Spring Security + JWT / NextAuth on UI).
- Consider Docker + docker-compose to bundle API + Postgres + UI in one run.

Happy building!
