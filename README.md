# VoiceScript - Frontend

Web app for managing transcription jobs. Built with React 19, TypeScript, Vite, TanStack Query, and Tailwind CSS.

## How to Run Locally

**Prerequisites:** Node.js, pnpm

```bash
pnpm install
pnpm dev          # Start dev server at http://localhost:5173
pnpm build        # Type-check + production build
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
```

The backend API must be running on `http://localhost:3030`. See `vite.config.ts` for proxy settings.

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/login` | LoginPage | Email/password sign-in. Public. |
| `/register` | RegisterPage | Create account with name, email, password, role, location. Public. |
| `/` | DashboardPage | Lists all jobs in a table with status filters (All / New / Assigned / Transcribed / Reviewed / Completed). "Create Job" button. Protected. |
| `/jobs/new` | CreateJobPage | Form to create a new transcription job (case name, duration, location, rates). Protected. |
| `/jobs/:id` | JobDetailPage | Single job detail with status actions (assign reporter, assign editor, mark transcribed, mark completed) and payment breakdown. Protected. |

All protected routes require authentication. Unauthenticated users are redirected to `/login`.
