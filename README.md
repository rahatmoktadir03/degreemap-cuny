# DegreeMap – CUNY Degree Planning Tool

A full-stack degree planning app for CUNY students. DegreeMap helps students explore CUNY campuses, build a visual semester-by-semester roadmap, track progress toward graduation, share plans, and lets advisors review their students' roadmaps.

## 🎯 Features

### 📍 Campus Explorer
- Interactive Leaflet map of all 25 CUNY campuses
- Search and filter by name, borough, and campus type (Senior / Community / Graduate)
- Per-campus detail page with programs, stats, and student reviews

### ⭐ Campus Reviews
- Rate campuses (1–5) with written reviews and category breakdowns
- Reviews stored in Supabase and visible to everyone

### 🗺️ Roadmap Builder (React Flow)
- Visual drag-and-drop canvas with four node types: Course, Milestone, Elective, Career Goal
- Per-node editing: label, credits, **structured term + year**, status (Planned / In Progress / Complete), notes
- **Auto-save** with a saved/unsaved indicator, **undo/redo** (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z)
- **Credit-total validation** against the 120-credit degree target
- Start from prebuilt templates (CS @ Hunter, Nursing @ Hunter, BBA @ Baruch)

### 📊 My Journey Dashboard
- Live degree-progress bar and credit breakdown (Recharts pie + chronological per-semester bars)
- Milestones derived from real earned credits (30/60/90/120 tiers)
- Expected graduation and major pulled from your profile

### 🎓 Student Dashboard
- Stat cards (credits earned, GPA, roadmap count, next milestone) computed from real data
- Editable profile: name, home campus, major, and **GPA**
- Roadmap list with progress bars + quick links

### 🧑‍🏫 Advisor Dashboard
- Role-gated student roster backed by the database (search, status, credits, GPA)
- Per-student detail view with notes/comments
- Advisor accounts get an **Advisor badge** and nav link

### 🔗 Shareable Roadmaps
- Generate read-only share links; no auth required to view

### 🌙 Dark Mode + 📱 Responsive
- Class-based dark mode (Tailwind v4 `@custom-variant`), persisted to localStorage
- Mobile-first responsive layouts

### 🔐 Authentication
- Supabase Auth (JWT); protected routes; graceful demo-mode fallback when offline

## 🛠 Tech Stack

**Frontend:** React 19 + TypeScript, Vite 5, Tailwind CSS 4, React Router 6, React Flow 11, React Leaflet, Recharts, lucide-react, react-hot-toast

**Backend:** Express 4 + TypeScript (ES modules, ts-node), Supabase JS

**Database:** Supabase PostgreSQL with Row Level Security

## 📋 Project Structure

```
degreemap-cuny/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Navbar, CampusMap, roadmap/, ui/, ...
│   │   ├── pages/           # Landing, Explore, SchoolDetail, Dashboard,
│   │   │                    # RoadmapBuilder, Journey, Advisor, SharedRoadmap, ...
│   │   ├── services/        # apiClient, roadmapService, advisorService, supabase
│   │   ├── store/           # AuthContext, DarkModeContext
│   │   ├── data/            # cunyCampuses, roadmapTemplates, semester, constants
│   │   └── App.tsx
│   ├── vercel.json          # SPA rewrites for Vercel
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/          # auth, schools(reviews), users, roadmaps, advisor
│   │   ├── controllers/     # request handlers
│   │   ├── services/        # Supabase data access
│   │   ├── middleware/      # JWT auth
│   │   └── index.ts
│   ├── DATABASE_SETUP.sql           # canonical fresh-install schema
│   ├── MIGRATION_2026-05-30.sql     # additive: roadmaps cols, role, comments
│   ├── MIGRATION_2026-06-01.sql     # additive: profiles.gpa
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Supabase project (free tier is fine)

### 1. Install
```bash
cd client && npm install
cd ../server && npm install
```

### 2. Environment variables
`client/.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:5000
```
`server/.env`:
```
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=http://localhost:5173
```
> `SUPABASE_SERVICE_ROLE_KEY` is secret — keep it server-side only. The anon key is safe to expose in the client.

### 3. Set up the database
In the Supabase SQL editor:
1. Run **`server/DATABASE_SETUP.sql`** for a fresh project (it includes `profiles`, `roadmaps`, `roadmap_comments`, `journey_milestones`, `campus_reviews`, `profiles.gpa`, `profiles.role`, and RLS policies).
   - For an *existing* project, run the additive migrations instead: `MIGRATION_2026-05-30.sql` then `MIGRATION_2026-06-01.sql`.
2. Add the **new-user trigger** so each signup automatically gets a `profiles` row:
   ```sql
   create or replace function public.handle_new_user()
   returns trigger language plpgsql security definer set search_path = public as $$
   begin
     insert into public.profiles (id, name, school, major)
     values (new.id,
             new.raw_user_meta_data->>'name',
             new.raw_user_meta_data->>'school',
             new.raw_user_meta_data->>'major')
     on conflict (id) do nothing;
     return new;
   end; $$;

   drop trigger if exists on_auth_user_created on auth.users;
   create trigger on_auth_user_created
     after insert on auth.users
     for each row execute function public.handle_new_user();
   ```
> Campus catalog data lives in the frontend (`client/src/data/cunyCampuses.ts`) — there is no `schools` table.

### 4. Run locally
```bash
# terminal 1
cd server && npm run dev      # http://localhost:5000

# terminal 2
cd client && npm run dev      # http://localhost:5173
```

## 🧑‍🏫 Making a user an advisor

New accounts default to `role = 'student'`. To promote one (after it has registered):
```sql
UPDATE profiles
SET role = 'advisor'
WHERE id = (SELECT id FROM auth.users WHERE email = 'advisor@example.com');
```
Once promoted, that account sees an **Advisor** badge + nav link and can open `/advisor`.

## 🔄 Key API Endpoints

**Auth:** `POST /api/auth/register`, `POST /api/auth/login`

**Users:** `GET /api/users/me`, `PUT /api/users/me` (name, school, major, graduation_year, gpa)

**Roadmaps (auth):** `POST /api/roadmaps`, `GET /api/roadmaps/mine`, `GET /api/roadmaps/detail/:id`, `PUT /api/roadmaps/:id`, `DELETE /api/roadmaps/:id` · public: `GET /api/roadmaps/templates`, `GET /api/roadmaps/public/:shareId`

**Reviews:** `POST` / `GET /api/schools/:schoolId/reviews`, `DELETE /api/schools/:schoolId/reviews/:reviewId`

**Advisor (role-gated):** `GET /api/advisor/students`, `GET /api/advisor/students/:studentId/roadmaps`, `GET`/`POST /api/advisor/roadmaps/:roadmapId/comments`

## ☁️ Deployment (Vercel frontend + Node backend)

DegreeMap is two apps: a static Vite **frontend** and a long-running Express **backend**. Vercel hosts the frontend; deploy the Express server to a Node host (e.g. **Render** or **Railway**).

### Backend (Render / Railway)
1. New Web Service from this repo, **root directory `server`**.
2. Build: `npm install && npm run build` · Start: `npm start`.
3. Env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `FRONTEND_URL` (your Vercel URL, for CORS). `PORT` is provided by the host and read automatically.
4. Note the public URL (e.g. `https://degreemap-api.onrender.com`).

### Frontend (Vercel)
1. Import the repo; set **Root Directory** to `client`.
2. Framework preset: **Vite** · Build: `npm run build` · Output: `dist`.
3. Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` = your backend URL from above (not `localhost`)
4. SPA routing is handled by `client/vercel.json` (rewrites all paths to `index.html`).

### Don't forget
- Apply `DATABASE_SETUP.sql` (or the migrations) **and** the `handle_new_user` trigger to the Supabase project the deployment uses.
- Set the backend's `FRONTEND_URL` to the deployed Vercel domain so CORS allows it.
- Without a deployed backend the app still runs (Supabase auth + localStorage roadmaps), but server persistence, reviews, and the advisor view require it.

## 🐛 Troubleshooting
- **`column ... does not exist`** errors from the API → your Supabase project is behind on migrations; run `DATABASE_SETUP.sql` or the migration files.
- **"Couldn't load your roadmaps"** → the backend isn't running / `VITE_API_URL` is wrong.
- **Advisor view shows an access error** → the account isn't `role = 'advisor'`, or it's a demo-mode session (no auth token).
- **No profile row after signup** → add the `handle_new_user` trigger above.

## 📝 Future Enhancements
- Server-side input validation (zod) and rate limiting
- Automated test suite
- Export roadmap as PDF
- Email notifications

## 📄 License
MIT License — see LICENSE file.

---
**Last Updated:** June 2026
