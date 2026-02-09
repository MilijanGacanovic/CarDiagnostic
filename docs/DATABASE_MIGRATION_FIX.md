# Database Migration Fix

## Problem
The POST /api/auth/register endpoint was returning a 500 error in production (Vercel/Neon) because the Prisma schema was not being applied to the database during deployment.

## Root Cause
- The project was using `npx prisma db push` for local development
- No migration files existed in `prisma/migrations/`
- The build script (`npm run build`) only ran `next build`, not database migrations
- When deploying to production, the User table didn't exist, causing all registration attempts to fail with a 500 error

## Solution

### 1. Created Prisma Migrations
- Created initial migration in `prisma/migrations/20240101000000_init/`
- This migration creates the User table with all necessary fields and constraints
- Added `migration_lock.toml` to specify PostgreSQL as the provider

### 2. Updated Build Script
Modified `package.json` to run migrations automatically during deployment:
```json
"build": "prisma migrate deploy && next build"
```

This ensures that:
- Every deployment first applies pending migrations to the database
- The database schema is always in sync with the code
- The 500 error won't occur in production

### 3. Added Automated Tests
Created `__tests__/api/auth/register.test.ts` with three tests:
1. **User registration and persistence**: Verifies users can be created and retrieved
2. **Unique email constraint**: Ensures database enforces unique emails
3. **Migration verification**: Confirms the database schema is correctly applied

These tests will:
- Fail during deployment if migrations aren't applied
- Catch database schema issues before they reach production
- Provide confidence that the registration flow works end-to-end

## How It Works

### Development
```bash
npx prisma migrate dev    # Create and apply migrations
npm run dev               # Start development server
```

### Production (Vercel)
When you deploy to Vercel:
1. `npm install` runs → `prisma generate` creates client (via postinstall)
2. `npm run build` runs → `prisma migrate deploy` applies migrations
3. `next build` runs → Creates production build
4. Application starts with database schema applied

### Testing
```bash
npm test  # Runs all tests including database migration tests
```

## Benefits
1. **Automatic schema updates**: No manual database setup required in production
2. **Fail-fast deployment**: Tests catch migration issues during build
3. **Version controlled schema**: All schema changes tracked in git
4. **Idempotent deployments**: Safe to redeploy multiple times
5. **Production parity**: Same migration process in dev and production
