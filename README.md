# Wael Electricity Billing

A migrated electricity billing and accounting system built from a legacy Oracle Forms workflow into a modern web stack.

## Stack
- Frontend: Angular 21
- Backend: NestJS 10
- Database: PostgreSQL
- Legacy migration source: Oracle export dumps

## Project Structure
- `angular-project/` Angular frontend application
- `nestjs-backend/` NestJS API and migration scripts
- `reports/` migration and UI audit notes
- `migration-plan-electricity.md` migration roadmap

## Current Status
- Git repository initialized and connected to GitHub
- Angular frontend upgraded to version 21
- Backend connected to PostgreSQL
- Legacy Oracle data cloned and restored into PostgreSQL
- Core electricity pages available in the new UI
- Working pages currently include subscribers, billing, collections, and messages

## Run Locally
### Frontend
```bash
cd angular-project
npm install
npm start
```

### Backend
```bash
cd nestjs-backend
npm install
npm run build
npm run start:dev
```

## Environment
Create your backend environment file from `.env.example` and adjust the database connection for your machine.

Typical local frontend URL:
- `http://localhost:4200`

Typical local backend URL:
- `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`

## Legacy Migration Notes
The project includes scripts to move legacy Oracle dump data into PostgreSQL:
- `nestjs-backend/scripts/migrate-oracle-to-postgres-replace.js`
- `nestjs-backend/scripts/clone-oracle-full-raw.js`

Supporting notes are available in:
- `reports/legacy-clone-audit-2026-04-07.md`
- `reports/electricity-ui-review-2026-04-07.md`

## Goal
Rebuild the original electricity workflow end to end:
- subscriber profile
- meter readings
- monthly billing
- posting and settlement
- collections
- messages and follow-up
- electricity reports
