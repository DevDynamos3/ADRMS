# Ahmadiyyah Record Management System (ADRMS)

A professional, full-stack web application for managing organizational records, inspired by Excel's structured approach but built with modern web technologies.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite (Development) / PostgreSQL (Production ready) via Prisma ORM
- **Styling**: Tailwind CSS 4
- **Excel Handling**: `xlsx` library for robust parsing and generation
- **Authentication**: Secure session handling with standard crypto

## Features

- **Dashboard**: Overview of records and financial totals.
- **Records Management**: Data table with sorting, searching, and inline editing.
- **Excel Upload**: Smart import with preview and validation.
- **Excel Export**: Download records in standard format.
- **Admin Authentication**: Secure login system.

## Getting Started

### Prerequisites

- Node.js 18+ established.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize Database:
   ```bash
   npx prisma db push
   ```

3. Seed Admin User:
   ```bash
   npx tsx prisma/seed.ts
   ```
   *Note: This creates a default admin user:*
   - **Email**: `admin@adrms.com`
   - **Password**: `admin123`

### Running Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Switch to PostgreSQL

1. Update `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/adrms?schema=public"
   ```
2. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
