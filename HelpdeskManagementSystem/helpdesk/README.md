# Helpdesk Management System

A full-stack helpdesk ticket management system built with Next.js 16, TypeScript, Prisma, and PostgreSQL.

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (HTTP-only cookies)
- **Forms:** React Hook Form
- **Validation:** Zod
- **Styling:** Tailwind CSS

## Features

- Role-based access control (Manager, Technical, Employee)
- Ticket CRUD with sequential ticket numbering
- Dashboard with role-specific statistics
- Ticket filtering, search, and sorting
- Activity timeline tracking
- Comments on tickets
- Full authentication (register, login, logout)

## Prerequisites

- Node.js 20+
- PostgreSQL

## Installation

```bash
git clone <repository-url>
cd helpdesk
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and update the values:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/helpdesk"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

## Database Setup

```bash
# Run migrations
npx prisma migrate dev --name init

# Seed the database
npx prisma db seed

# (Optional) Open Prisma Studio
npx prisma studio
```

## Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Login Credentials

### Managers
| Email | Password |
|-------|----------|
| manager1@company.com | password123 |
| manager2@company.com | password123 |

### Technical Staff
| Email | Password |
|-------|----------|
| tech1@company.com | password123 |
| tech2@company.com | password123 |
| tech3@company.com | password123 |

### Employees
| Email | Password |
|-------|----------|
| emp1@company.com | password123 |
| emp2@company.com | password123 |
| emp3@company.com | password123 |

## Project Structure

```
src/
├── app/                    # App Router pages
│   ├── dashboard/          # Dashboard page
│   ├── login/              # Login page
│   ├── register/           # Register page
│   ├── tickets/            # Ticket pages
│   │   ├── create/         # Create ticket page
│   │   └── [id]/           # Ticket detail page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── actions/                # Server Actions
│   ├── auth.ts             # Authentication actions
│   └── tickets.ts          # Ticket actions
├── components/             # React components
│   ├── dashboard/          # Dashboard components
│   ├── forms/              # Form components
│   ├── layout/             # Layout components
│   ├── tickets/            # Ticket components
│   └── ui/                 # Reusable UI components
├── lib/                    # Utilities
│   ├── auth.ts             # Authentication helpers
│   ├── prisma.ts           # Prisma client
│   └── utils.ts            # Utility functions
├── schemas/                # Zod validation schemas
└── proxy.ts                # Next.js middleware (authentication guard)
```

## Role Permissions

### Manager
- View all tickets
- Assign tickets to technical staff
- Change ticket priority
- Change ticket status
- View team workload

### Technical Employee
- View assigned tickets only
- Change ticket status (IN_PROGRESS, RESOLVED)
- Add comments on assigned tickets
- Resolve tickets

### Employee
- Create tickets
- View only their own tickets
- Confirm ticket resolution (CLOSE)
