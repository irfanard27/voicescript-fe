# Frontend Plan — Court Reporting Dashboard

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 (Vite) |
| Language | TypeScript |
| Routing | React Router v7 |
| Server State | TanStack Query |
| Styling | Tailwind CSS v4 |
| HTTP Client | fetch (wrapped in hooks) |
| Auth | JWT in localStorage + AuthContext |

---

## Project Structure

```
frontend/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── queryClient.ts
    ├── api/
    │   ├── client.ts
    │   └── hooks.ts
    ├── context/
    │   └── AuthContext.tsx
    ├── components/
    │   ├── Layout.tsx
    │   ├── ProtectedRoute.tsx
    │   └── StatusBadge.tsx
    ├── pages/
    │   ├── LoginPage.tsx
    │   ├── RegisterPage.tsx
    │   ├── DashboardPage.tsx
    │   ├── JobDetailPage.tsx
    │   └── CreateJobPage.tsx
    └── types/
        └── index.ts
```

---

## Routes

| Path | Page | Auth Required |
|---|---|---|
| `/login` | LoginPage | No |
| `/register` | RegisterPage | No |
| `/` | DashboardPage | Yes |
| `/jobs/new` | CreateJobPage | Yes |
| `/jobs/:id` | JobDetailPage | Yes |

---

## API Client (`src/api/client.ts`)

Thin fetch wrapper:
- `baseURL = http://localhost:3030/api/v1`
- Automatically attaches `Authorization: Bearer <token>` from localStorage
- Parses JSON response
- Throws on non-2xx (caught by TanStack hooks)

---

## TanStack Hooks (`src/api/hooks.ts`)

All API interactions as custom hooks:

| Hook | Method | Endpoint | Returns |
|---|---|---|---|
| `useLogin()` | POST | `/auth/login` | mutation |
| `useRegister()` | POST | `/auth/register` | mutation |
| `useMe()` | GET | `/auth/me` | `{ data, isLoading, error }` |
| `useJobs(status?)` | GET | `/jobs[?status=]` | `{ data, isLoading, error }` |
| `useJob(id)` | GET | `/jobs/:id` | `{ data, isLoading, error }` |
| `useCreateJob()` | POST | `/jobs` | mutation |
| `useAssignReporter()` | POST | `/jobs/:id/assign-reporter` | mutation |
| `useAssignEditor()` | POST | `/jobs/:id/assign-editor` | mutation |
| `useUpdateStatus()` | PATCH | `/jobs/:id/status` | mutation |
| `usePayment(id)` | GET | `/jobs/:id/payment` | `{ data, isLoading, error }` |
| `useReporters()` | GET | `/reporters` | `{ data, isLoading, error }` |
| `useEditors()` | GET | `/editors` | `{ data, isLoading, error }` |

Mutation hooks auto-invalidate related queries on success:
- `useAssignReporter` → invalidates `["jobs", id]`
- `useAssignEditor` → invalidates `["jobs", id]`
- `useUpdateStatus` → invalidates `["jobs", id]`
- `useCreateJob` → invalidates `["jobs"]`

---

## Auth Flow

```
Login → useLogin().mutateAsync({ email, password })
  → on success: store token + user in AuthContext + localStorage
  → redirect to "/"

Register → useRegister().mutateAsync(data)
  → on success: store token + user in AuthContext + localStorage
  → redirect to "/"

ProtectedRoute
  → if no token → <Navigate to="/login" />
  → if token but no user loaded → show spinner (useMe() isLoading)
  → if token invalid (401) → clear token, redirect to /login
  → if user loaded → render children
```

### AuthContext shape

```typescript
interface AuthContextValue {
  user: { id: number; email: string; name: string; role: string } | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
```

Initialization: on mount, reads token from `localStorage`. If found, calls `useMe()` to validate. On 401, clears token.

---

## Pages

### LoginPage

```
┌──────────────────────┐
│      Login           │
│  ┌────────────────┐  │
│  │ Email          │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ Password       │  │
│  └────────────────┘  │
│  [Login]             │
│  Don't have account? │
│  Register here       │
└──────────────────────┘
```

- Uses `useLogin()` mutation
- Shows validation errors inline
- Link to `/register`

### RegisterPage

```
┌──────────────────────┐
│     Register         │
│  ┌────────────────┐  │
│  │ Name           │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ Email          │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ Password       │  │
│  └────────────────┘  │
│  Role: [▼ Select]   │
│  ┌────────────────┐  │
│  │ Location (opt) │  │
│  └────────────────┘  │
│  [Register]          │
│  Already registered? │
│  Login here          │
└──────────────────────┘
```

### DashboardPage

```
┌────────────────────────────────────────────┐
│  [+ Create Job]                            │
│                                            │
│  Status filter: [All|New|Assigned|...]     │
│                                            │
│  ┌──────┬────────┬──────┬────────┬──────┐  │
│  │ Case │  Dur   │ Loc  │ Status │ Acts │  │
│  ├──────┼────────┼──────┼────────┼──────┤  │
│  │ St.. │ 45min  │ Phy  │ ● NEW  │ View │  │
│  │ Joh. │ 30min  │ Rem  │ ● ASGN │ View │  │
│  │ ...  │        │      │        │      │  │
│  └──────┴────────┴──────┴────────┴──────┘  │
└────────────────────────────────────────────┘
```

- Uses `useJobs(statusFilter)` — auto-refetches when filter changes
- Status badges are colored pills (NEW=gray, ASSIGNED=blue, TRANSCRIBED=yellow, REVIEWED=orange, COMPLETED=green)
- Click "View" → navigate to `/jobs/:id`
- Click "Create Job" → navigate to `/jobs/new`

### CreateJobPage

```
┌────────────────────────────────┐
│      Create New Job            │
│                                │
│  Case Name:  [______________]  │
│  Duration:   [________] min   │
│  Location:   [▼ physical   ]  │
│  Rep. Rate:  [2000] IDR/min   │
│  Editor Fee: [10000] IDR      │
│                                │
│  [Cancel]          [Create]   │
└────────────────────────────────┘
```

- Uses `useCreateJob()` mutation
- On success → `navigate("/jobs/:id")` with new job ID

### JobDetailPage

```
┌─────────────────────────────────────┐
│  ← Back to Dashboard                │
│                                     │
│  State vs. Smith                    │
│  ─────────────────────────────      │
│  Duration:  45 min  │ Physical     │
│  Status:    ● REVIEWED             │
│  ─────────────────────────────      │
│                                     │
│  Assign Reporter  [ ✓ Done]        │
│    Alice (Jakarta)                  │
│  ─────────────────────────────      │
│  Assign Editor    [✓ Done]         │
│    Charlie                          │
│  ─────────────────────────────      │
│  Actions                            │
│    [Mark Completed]                 │
│  ─────────────────────────────      │
│  Payment                            │
│    Reporter:  45 × 2000 = 90,000   │
│    Editor:             10,000       │
│    Total:             100,000 IDR   │
└─────────────────────────────────────┘
```

Sections shown conditionally based on current status:

| Section | Shows when status |
|---|---|
| Assign Reporter | `new` |
| Assign Editor | `transcribed` |
| Status action button | `assigned` (→Transcribed), `reviewed` (→Completed) |
| Payment card | Always (if reporter/editor assigned) |

- Uses `useJob(id)` + `usePayment(id)`
- Mutation hooks auto-invalidate after each action

---

## QueryClient Config (`src/queryClient.ts`)

```typescript
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

---

## Layout Component

```
┌─────────────────────────────────────┐
│  ⚖️ CourtReporter    John (admin)  │
│                      [Logout]       │
├────────┬────────────────────────────┤
│        │                            │
│  📋    │  <Outlet />               │
│  Dashboard   (page content)        │
│        │                            │
│  ➕    │                            │
│  New Job   │                        │
│        │                            │
└────────┴────────────────────────────┘
```

Sidebar: Dashboard link, Create Job link
Header: user name + role + logout button

---

## Tailwind Setup

```
npm install -D tailwindcss @tailwindcss/vite
```

Vite config plugin: `tailwindcss()`

No config file needed for Tailwind v4 — use `@import "tailwindcss"` in CSS entry.

---

## Vite Dev Proxy

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "http://localhost:3030",
    },
  },
});
```

Frontend on `:5173`, `/api/*` requests forwarded to backend `:3030`.
No CORS issues in dev.

---

## Scaffold Commands

```bash
cd ..
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install react-router-dom @tanstack/react-query @tanstack/react-query-devtools
npm install -D tailwindcss @tailwindcss/vite
```

---

## Implementation Order

1. Scaffold Vite project + install deps
2. Configure Tailwind + Vite proxy
3. Create `queryClient.ts`
4. Create `api/client.ts` (fetch wrapper)
5. Create `api/hooks.ts` (all TanStack hooks)
6. Create `types/index.ts`
7. Create `AuthContext.tsx`
8. Create `ProtectedRoute.tsx`
9. Create `Layout.tsx` + `StatusBadge.tsx`
10. Create `LoginPage.tsx` + `RegisterPage.tsx`
11. Create `DashboardPage.tsx`
12. Create `CreateJobPage.tsx`
13. Create `JobDetailPage.tsx`
14. Wire up `App.tsx` + `main.tsx`
15. Test full flow
