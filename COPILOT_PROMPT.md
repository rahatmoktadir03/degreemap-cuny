# DegreeMap — CUNY Edition

## GitHub Copilot Agent Prompt (VS Code)

---

Paste the following into your Copilot Chat panel in VS Code using Agent mode (`@workspace`):

---

```
You are helping me build a full-stack web application called **DegreeMap — CUNY Edition**.

---

## What It Is

DegreeMap is a visual, interactive platform for CUNY (City University of New York) students.
It is inspired by roadmap.sh in its visual, node-based style, but applied to academic planning.
The app has three core pillars:

1. **CUNY School Explorer** — An interactive Leaflet map showing all 25 CUNY campuses with
   per-school stats (enrollment, programs, location, school type).

2. **Roadmap Builder** — A visual, node-based academic path builder using React Flow where
   students can create a semester-by-semester roadmap of courses, milestones, and goals.
   Think roadmap.sh but for your college degree.

3. **My Journey Dashboard** — A personal dashboard where a logged-in student can track
   their progress against their saved roadmap (courses marked complete, credits completed, etc.)

The scope is CUNY-only for now. We are NOT building for every college in the US — just the
25 CUNY schools. Start small, build it well.

---

## Tech Stack

Use the following technologies exactly — do not substitute:

- **Frontend**: React + TypeScript (bootstrapped with Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Roadmap Canvas**: React Flow (for node-based roadmap builder)
- **Map**: Leaflet.js via react-leaflet
- **Charts**: Recharts
- **Backend**: Node.js + Express + TypeScript
- **Database & Auth**: Supabase (hosted PostgreSQL + built-in Auth + Row Level Security)
- **Supabase Client**: @supabase/supabase-js (used on both client and server)
- **Deployment target**: Vercel (frontend), Render or Railway (backend)

---

## Project Structure

Scaffold the project as a monorepo with two top-level directories:

```

degreemap/
├── client/ # Vite + React + TypeScript frontend
├── server/ # Node + Express + TypeScript backend
├── IMPLEMENTATION.md
└── README.md

````

Inside `client/src/`:
- `components/`   — reusable UI components
- `pages/`        — route-level pages
- `hooks/`        — custom React hooks
- `store/`        — global auth/user state (React Context or Zustand)
- `services/`     — all API call functions (axios or fetch wrappers)
- `types/`        — shared TypeScript interfaces
- `utils/`        — helper functions

Inside `server/src/`:
- `routes/`       — Express router files
- `controllers/`  — handler logic (thin controllers, logic in services)
- `middleware/`   — auth middleware, error handler
- `services/`     — business logic
- `supabase/`     — Supabase client init + SQL seed scripts
- `utils/`        — helpers

---

## Database Schema (Supabase)

Create the following tables in your Supabase project via the SQL editor.
Supabase handles the `users` table automatically through its Auth system —
we extend it with a `profiles` table via a trigger.

```sql
-- Extends Supabase Auth users with extra profile info
create table profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  name        text,
  school      text,
  major       text,
  created_at  timestamp with time zone default now()
);

-- Auto-create a profile row when a new user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- CUNY Schools
create table schools (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  borough     text not null,
  type        text not null, -- 'senior' | 'community' | 'graduate'
  lat         float not null,
  lng         float not null,
  enrollment  int,
  founded     int,
  website     text,
  programs    text[],
  image_url   text
);

-- Roadmaps
create table roadmaps (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references profiles(id) on delete cascade,
  title        text not null,
  major        text,
  school       text,
  is_template  boolean default false,
  share_token  text unique,
  created_at   timestamp with time zone default now(),
  updated_at   timestamp with time zone default now()
);

-- Roadmap Nodes (React Flow nodes)
create table roadmap_nodes (
  id          uuid default gen_random_uuid() primary key,
  roadmap_id  uuid references roadmaps(id) on delete cascade,
  node_id     text not null,  -- React Flow internal id
  type        text not null,  -- 'course' | 'milestone' | 'elective' | 'goal'
  label       text not null,
  credits     int,
  semester    text,           -- e.g., 'Fall 2025'
  status      text default 'planned', -- 'planned' | 'in-progress' | 'complete'
  notes       text,
  position_x  float not null,
  position_y  float not null
);

-- Roadmap Edges (React Flow connections)
create table roadmap_edges (
  id          uuid default gen_random_uuid() primary key,
  roadmap_id  uuid references roadmaps(id) on delete cascade,
  edge_id     text not null,
  source      text not null,
  target      text not null
);

-- Row Level Security (RLS) — users can only access their own data
alter table profiles      enable row level security;
alter table roadmaps      enable row level security;
alter table roadmap_nodes enable row level security;
alter table roadmap_edges enable row level security;

create policy "Users can read/write own profile"
  on profiles for all using (auth.uid() = id);

create policy "Users can read/write own roadmaps"
  on roadmaps for all using (auth.uid() = user_id);

create policy "Users can read/write own nodes"
  on roadmap_nodes for all
  using (roadmap_id in (select id from roadmaps where user_id = auth.uid()));

create policy "Users can read/write own edges"
  on roadmap_edges for all
  using (roadmap_id in (select id from roadmaps where user_id = auth.uid()));

-- Schools are public read
alter table schools enable row level security;
create policy "Schools are publicly readable"
  on schools for select using (true);

-- Template roadmaps are public read
create policy "Templates are publicly readable"
  on roadmaps for select using (is_template = true);
````

---

## API Endpoints to Build

**Note on Auth:** Supabase Auth handles registration, login, token refresh, and session
management entirely. Do NOT build custom auth endpoints — use `supabase.auth.signUp()`,
`supabase.auth.signInWithPassword()`, and `supabase.auth.signOut()` directly from the
frontend. On the backend, validate the Supabase JWT from the `Authorization` header using
the Supabase admin client to protect routes.

### Schools

- GET /api/schools (returns all 25 CUNY schools)
- GET /api/schools/:id (single school detail)

### Roadmaps

- GET /api/roadmaps/templates (pre-built roadmaps, public)
- GET /api/roadmaps/me (user's saved roadmaps, protected)
- GET /api/roadmaps/:id (single roadmap by id)
- POST /api/roadmaps (create new roadmap, protected)
- PUT /api/roadmaps/:id (save/update roadmap, protected)
- DELETE /api/roadmaps/:id (protected)
- GET /api/roadmaps/share/:token (public share view)

---

## Pages to Build (Frontend Routes)

| Route           | Page            | Notes                                                   |
| --------------- | --------------- | ------------------------------------------------------- |
| `/`             | Landing Page    | Hero, brief feature overview, CTA to explore or sign up |
| `/explore`      | CUNY Explorer   | Leaflet map + school stats sidebar                      |
| `/schools/:id`  | School Detail   | Full stats page for one campus                          |
| `/builder`      | Roadmap Builder | React Flow canvas, protected                            |
| `/builder/:id`  | Edit Roadmap    | Load existing roadmap into canvas                       |
| `/dashboard`    | My Journey      | Progress dashboard, protected                           |
| `/share/:token` | Shared Roadmap  | Read-only roadmap view                                  |
| `/login`        | Login           |                                                         |
| `/register`     | Register        |                                                         |

---

## Build Order (Follow This Sequence)

Build in this exact order. Complete each phase before starting the next:

**Phase 0 — Setup**
Initialize both client and server. Set up Tailwind, ESLint, and folder structure.
Create a Supabase project at supabase.com. Run the SQL schema in the Supabase SQL editor.
Initialize the Supabase client in both client and server using environment variables.
Create a `.env.example` file. Add `.env` to `.gitignore`.

**Phase 1 — CUNY School Explorer**
Seed the schools table via a Supabase SQL insert script or a one-time seed function.
Build the `/api/schools` endpoint (queries Supabase). Render the Leaflet map with markers.
Add a stats sidebar that opens on marker click.

**Phase 2 — Auth System**
Use Supabase Auth on the frontend — `supabase.auth.signUp()` and `signInWithPassword()`.
Build Register and Login pages. Store the Supabase session in React context.
On the backend, write middleware that validates the Supabase JWT from the Authorization header
using the Supabase admin client (`@supabase/supabase-js` with `service_role` key).
Add a protected route wrapper component on the frontend.

**Phase 3 — Roadmap Builder**
Set up React Flow with custom node types (course, milestone, elective, goal). Add a
semester lane layout. Make nodes editable. Build save/load to database. Add template roadmaps.

**Phase 4 — My Journey Dashboard**
Build the personal dashboard. Show roadmap progress, credits planned vs. completed, and node
status controls (planned / in progress / complete). Use Recharts for the credits chart.

**Phase 5 — Polish**
Responsive layout, dark mode, shareable roadmap links, deploy.

---

## CUNY School Seed Data

Include all 25 CUNY institutions in the seed file. Here are examples to get started — fill in
the rest:

```ts
const schools = [
  {
    name: "City College of New York",
    borough: "Manhattan",
    type: "senior",
    lat: 40.8198,
    lng: -73.9499,
    enrollment: 16000,
    founded: 1847,
    website: "https://www.ccny.cuny.edu",
    programs: [
      "Engineering",
      "Architecture",
      "Liberal Arts",
      "Science",
      "Education",
    ],
  },
  {
    name: "Brooklyn College",
    borough: "Brooklyn",
    type: "senior",
    lat: 40.6313,
    lng: -73.9524,
    enrollment: 15000,
    founded: 1930,
    website: "https://www.brooklyn.cuny.edu",
    programs: ["Business", "Arts", "Sciences", "Education", "Film"],
  },
  {
    name: "Queens College",
    borough: "Queens",
    type: "senior",
    lat: 40.7365,
    lng: -73.8172,
    enrollment: 19000,
    founded: 1937,
    website: "https://www.qc.cuny.edu",
    programs: [
      "Accounting",
      "Psychology",
      "Computer Science",
      "Music",
      "Education",
    ],
  },
  // ... continue for all 25 CUNY schools
];
```

---

## Commit History Guidelines

**I will commit all changes manually. Do not auto-commit anything.**

After completing each meaningful unit of work, suggest a commit message using this format:

```
<type>(<scope>): <short description>

Types: feat | fix | chore | docs | style | refactor | test
Scope: api | auth | map | builder | dashboard | db | ui | config

Examples:
feat(db): add Supabase SQL schema with RLS policies
feat(db): seed 25 CUNY schools via Supabase insert script
feat(api): expose GET /api/schools and GET /api/schools/:id
feat(map): render Leaflet map with CUNY campus markers
feat(map): add school stats sidebar on marker click
feat(auth): integrate Supabase Auth with register and login pages
feat(auth): add Supabase JWT middleware and protected route wrapper
feat(builder): scaffold React Flow canvas with custom node types
feat(builder): implement editable node fields and semester lanes
feat(builder): save and load roadmap from Supabase
feat(dashboard): build progress overview with Recharts credits chart
chore(config): set up ESLint, Prettier, and Tailwind
docs: finalize README with setup instructions and screenshots
```

---

## IMPLEMENTATION.md Tracker

There is a file called `IMPLEMENTATION.md` at the root of this project. After each phase or
significant feature, update the **Implementation Log** table in that file with the date, phase,
and a plain-English description of what was built and what it does. Keep it concise but
informative — it should read like a changelog a recruiter or teammate could skim.

---

## Design Notes

- Use a clean, modern, and professional look. Dark navy + electric blue or teal accent is a
  good direction, but you have creative freedom.
- The roadmap canvas should feel open and spacious — lots of room to build.
- The map page should feel data-forward, like a dashboard — not just a blank map.
- Prioritize clear typography and consistent spacing throughout.
- Accessibility matters: use semantic HTML, proper aria labels on interactive elements.

---

## Important Rules

- TypeScript strict mode on both client and server.
- Never handle raw passwords — Supabase Auth manages all password hashing internally.
- Never expose the Supabase `service_role` key on the frontend — it belongs only in the backend `.env`.
- The frontend only uses the Supabase `anon` key via the public client.
- Keep controllers thin — move logic to service files.
- All API responses follow the shape: `{ success: boolean, data: any, message?: string }`
- Handle errors gracefully — return proper HTTP status codes with error messages.
- Write clean, readable code with comments on non-obvious logic.

---

Start with **Phase 0** — scaffold the project structure and get both client and server running
with a simple health check endpoint (`GET /api/health` returns `{ success: true }`) and a
React page that displays "DegreeMap is live 🎓".

```

```
