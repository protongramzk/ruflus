# Ruflus

![Ruflus logo](assets/ruflus.png)

[![version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/protongramzk/ruflus)
[![bundler](https://img.shields.io/badge/bundler-vite-yellow)](https://vitejs.dev/)
[![framework](https://img.shields.io/badge/framework-React%20%7C%20TypeScript-61dafb)](https://reactjs.org/)
[![license](https://img.shields.io/badge/license-Unspecified-lightgrey)](https://github.com/protongramzk/ruflus)

One app to manage personal finances, group splits, savings goals, and bill reminders — designed to be simple, fast, and offline-first.

## Key features

- Dashboard
  - Snapshot of current balance, monthly income/expenses, upcoming bills, savings progress, active group splits, recent transactions.
- Finance
  - Record income and expenses.
  - Categorize transactions.
  - View transaction history and current balance.
  - Filters by date range, category, and type.
- Split (group shared expenses)
  - Create and manage split groups.
  - Add expenses to a group and split amounts among members.
  - Track who owes whom and settlement status.
- Savings
  - Create saving goals with target amounts and deadlines.
  - Track progress and deposit history for each goal.
- Bills
  - Create bill reminders with due dates, repeat options, and paid/unpaid status.
  - Track upcoming and overdue bills.
- Settings
  - Profile management, currency selection, backup and restore, theme selection (including dark mode).
- Offline-first local data storage
  - Initial implementation uses local storage options (IndexedDB / LocalStorage), with plans for cloud sync in later versions.
- Progressive Web App (PWA) target
  - Web-first with mobile-first design and PWA behavior in mind.

## Screenshots

Place screenshots or export images into `assets/` and reference them here. Example:
```
![Dashboard preview](assets/ruflus.png)
```

## Quick start — run locally

Requirements:
- Node.js (recommended 18+)
- npm (or an alternative package manager)

Install and run the dev server:
```bash
git clone https://github.com/protongramzk/ruflus.git
cd ruflus
npm install
npm run dev
```

Build and preview production bundle:
```bash
npm run build
npm run preview
```

Run tests:
```bash
npm run test
```

Scripts are provided in package.json:
- dev: vite
- build: tsc && vite build
- preview: vite preview
- test: vitest run

No application-specific environment variables are required to run the local dev server in its current (offline/local) form.

## Stack

- Language(s): TypeScript, JavaScript
- Framework/runtime: React (18/19) + Vite
- UI/Styling: Tailwind CSS, Cassava design guidelines used for layout
- Notable libraries:
  - react, react-dom
  - chart.js + react-chartjs-2 (for graphs)
  - lucide-react (icons)
  - tailwindcss (styling)
  - vitest (tests)

## Project structure (top-level overview)

```text
.
├─ ARCHITECTURE.md       # UI mappings and data model reference
├─ CONCEPT.md            # Vision, features, offline-first notes
├─ DESIGN.md             # Design guidelines and Cassava rules
├─ assets/               # Images and static assets (put ruflus.png here)
├─ index.html
├─ package.json
├─ public/               # Static public files
├─ src/
│  ├─ App.tsx            # Top-level app and navigation
│  ├─ main.tsx           # Entry point
│  ├─ index.css
│  ├─ vite-env.d.ts
│  ├─ components/
│  │  ├─ ui/             # Shared UI components (BottomNavigation, etc.)
│  │  ├─ finance/        # Transaction list, forms
│  │  ├─ split/          # Split UI components
│  │  ├─ savings/        # Savings UI components
│  │  ├─ bills/          # Bills UI components
│  │  └─ dashboard/      # Dashboard widgets
│  ├─ pages/
│  │  ├─ Dashboard.tsx
│  │  ├─ Finance.tsx
│  │  ├─ Split.tsx
│  │  ├─ SplitDetail.tsx
│  │  ├─ Savings.tsx
│  │  ├─ SavingDetail.tsx
│  │  ├─ Bills.tsx
│  │  ├─ BillDetail.tsx
│  │  └─ Settings.tsx
│  ├─ utils/             # Storage initialization, helpers
│  ├─ types/             # Shared TypeScript types
│  └─ tests/             # Vitest tests
├─ tsconfig.json
├─ vite.config.ts
```

How it fits together:
- App.tsx manages navigation state and acts as the shell (top sticky header + bottom navigation).
- Pages render module-specific UI; components/ contains reusable UI widgets.
- utils/storage contains the local persistence layer (initialization and profile retrieval).
- The dashboard reads summaries from each module and does not store data itself.

## Data model (summary)

Extracted from ARCHITECTURE.md — core entities and fields:

- Transaction
  - id, type (income | expense), amount, categoryId, accountId, note, createdAt, updatedAt
- Category
  - id, name, icon, type
- SavingGoal
  - id, name, targetAmount, currentAmount, deadline, note, createdAt
- SavingHistory
  - id, goalId, amount, note, createdAt
- SplitGroup
  - id, name, description, createdAt
- SplitMember
  - id, groupId, name
- SplitExpense
  - id, groupId, payerId, title, amount, createdAt
- SplitShare
  - id, expenseId, memberId, amount, settled
- Bill
  - id, title, amount, dueDate, repeat (none/daily/weekly/monthly/yearly), paid, note

Notes:
- Modules are designed to be independent; the Dashboard aggregates read-only views.
- Transactions are treated as immutable records; edits create updates or history entries.

## UI & UX notes

- Mobile-first layout with bottom navigation for main sections: Dashboard, Finance, Split, Savings, Bills.
- Thumb-first design: primary actions are reachable near the bottom of the screen (floating action button, bottom sheet patterns).
- Icons come exclusively from Lucide for visual consistency.
- Interactions are predictable: destructive actions require confirmation, edits follow consistent patterns.
- Empty states exist across screens and guide the user to create new items.

## Storage & Data persistence

- Current implementation uses local persistent storage (IndexedDB or LocalStorage).
- initializeStorage() is called from App.tsx to set up local storage and the initial profile.
- Profile supports theme selection and dark mode toggling; theme is set on the root element at runtime.
- Cloud sync is planned for future releases.

## Accessibility & responsiveness

- Focus on touch target sizes, legible text, and straightforward navigation.
- The primary target is mobile; desktop layout adapts from the mobile-first design.

## Contributing

- Read DESIGN.md and CASSAVA.md before introducing layout or spacing changes — they are the canonical design sources.
- Follow the repository's TypeScript, React, and Tailwind conventions.
- Run linting and tests locally before opening PRs:
  - npm run test
