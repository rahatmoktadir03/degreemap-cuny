# DegreeMap — CUNY Edition

### Implementation Tracker & Project Timeline

> **Cohort 11 | CUNY Tech Prep | Full-Stack Web Development Track**
> Last Updated: _update this each session_

---

## 🧭 Project Overview

**DegreeMap** is a visual, interactive platform built for CUNY students to explore campuses, plan their academic journey, and build personalized roadmaps toward their degree and career goals — inspired by the node-based visual style of [roadmap.sh](https://roadmap.sh).

### Three Core Pillars

| Pillar                  | Description                                                         |
| ----------------------- | ------------------------------------------------------------------- |
| 🗺️ CUNY School Explorer | Interactive map + per-campus stats for every CUNY school            |
| 🧭 Roadmap Builder      | Visual, node-based academic path builder (drag, connect, customize) |
| 📅 My Journey           | Personal dashboard to track progress against a chosen roadmap       |

---

## 🛠️ Tech Stack

| Layer           | Technology                                      |
| --------------- | ----------------------------------------------- |
| Frontend        | React + TypeScript                              |
| Styling         | Tailwind CSS                                    |
| Routing         | React Router v6                                 |
| Roadmap/Flow UI | React Flow                                      |
| Map             | Leaflet.js + React-Leaflet                      |
| Charts/Stats    | Recharts                                        |
| Backend         | Node.js + Express                               |
| Database & Auth | Supabase (hosted PostgreSQL + Auth + RLS)       |
| Supabase Client | @supabase/supabase-js                           |
| Deployment      | Vercel (frontend) + Render or Railway (backend) |

---

## 📦 Project Structure (Target)

```
degreemap/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # Global state (Context or Zustand)
│   │   ├── services/        # API call functions
│   │   ├── types/           # TypeScript types & interfaces
│   │   └── utils/           # Helper functions
│   └── public/
├── server/                  # Express backend
│   ├── src/
│   │   ├── routes/          # API route definitions
│   │   ├── controllers/     # Route handler logic
│   │   ├── middleware/      # Auth, error handling, etc.
│   │   ├── prisma/          # Schema & migrations
│   │   └── utils/
├── IMPLEMENTATION.md        # ← You are here
└── README.md
```

---

## 🗺️ Feature Phases

### ✅ Phase 0 — Project Setup

- [ ] Initialize monorepo (client + server folders)
- [ ] Set up React + TypeScript (Vite)
- [ ] Set up Express + TypeScript
- [ ] Configure Tailwind CSS
- [ ] Create Supabase project at supabase.com
- [ ] Run SQL schema in Supabase SQL editor (tables + RLS policies)
- [ ] Initialize Supabase client in client and server
- [ ] Create `.env` files and add to `.gitignore`
- [ ] Set up ESLint + Prettier
- [ ] Write base `README.md`

**Suggested Commit Message:**

```
chore: initialize project structure with React, Express, and Supabase
```

---

### ✅ Phase 1 — CUNY School Explorer (Map + Stats)

- [ ] Insert all 25 CUNY schools into Supabase `schools` table via SQL seed script
- [ ] Build `/api/schools` REST endpoint (queries Supabase)
- [ ] Render interactive Leaflet map with a marker per campus
- [ ] Clicking a marker opens a sidebar/modal with school stats
- [ ] Stats include: enrollment size, available majors/programs, campus type, borough
- [ ] Add search/filter bar (by borough, school type)
- [ ] Style the map with a clean, branded tile layer

**Suggested Commit Messages:**

```
feat(db): seed 25 CUNY schools into Supabase schools table
feat(api): expose GET /api/schools and GET /api/schools/:id
feat(map): render interactive CUNY campus map with Leaflet markers
feat(map): add school stats sidebar with enrollment and program details
feat(map): add search and filter controls to school explorer
```

---

### ✅ Phase 2 — Auth System

- [ ] Use Supabase Auth — signUp and signInWithPassword on frontend
- [ ] Build Register and Login pages
- [ ] Store Supabase session in React context/store
- [ ] Add protected route wrapper component
- [ ] Write backend middleware to validate Supabase JWT (service_role key)

**Suggested Commit Messages:**

```
feat(auth): integrate Supabase Auth with register and login pages
feat(auth): add Supabase JWT middleware and protected route wrapper
```

---

### ✅ Phase 3 — Roadmap Builder (Core Feature)

- [ ] Set up React Flow canvas
- [ ] Define node types: Course Node, Milestone Node, Elective Node, Career Goal Node
- [ ] Allow users to add, connect, and delete nodes
- [ ] Each node is editable (course name, credits, semester, notes)
- [ ] Add a semester grouping/lane system (Fall/Spring columns)
- [ ] Save roadmap to database (per user)
- [ ] Load saved roadmap on return visit
- [ ] Add "Template Roadmaps" for common CUNY majors (pre-built starting points)

**Suggested Commit Messages:**

```
feat: scaffold React Flow canvas with custom course and milestone nodes
feat: implement editable node fields (title, credits, semester, notes)
feat: add semester lane layout to roadmap canvas
feat(api): add POST /api/roadmaps and GET /api/roadmaps/:userId endpoints
feat: save and load user roadmap from database
feat: add pre-built template roadmaps for common CUNY majors
```

---

### ✅ Phase 4 — My Journey Dashboard

- [x] Build personal dashboard page (protected route)
- [x] Show roadmap progress (% of nodes marked complete)
- [x] Students can mark nodes/courses as Complete, In Progress, or Planned
- [x] Display semester-by-semester timeline view
- [x] Show total credits planned vs. completed
- [x] Credit progress bar / ring chart (Recharts)
- [x] Quick-link to their saved roadmap

**Suggested Commit Messages:**

```
feat: build student dashboard with roadmap progress overview
feat: add node completion status (complete / in progress / planned)
feat: add credits tracker with progress chart on dashboard
```

---

### ✅ Phase 5 — Polish & Stretch Goals

- [x] Add responsive/mobile-friendly layout
- [x] Add dark mode toggle
- [x] Allow users to share a read-only link to their roadmap
- [ ] Add a "Rate My School" or review section per campus
- [ ] Add advisor view (view a student's roadmap with comment ability)
- [ ] Deploy frontend to Vercel and backend to Render
- [x] Write full `README.md` with setup instructions and screenshots

**Suggested Commit Messages:**

```
feat: add responsive mobile layout and dark mode toggle
feat: implement shareable read-only roadmap links
chore: deploy frontend to Vercel and backend to Render
docs: finalize README with setup guide and feature screenshots
```

---

## 📋 Implementation Log

> Add an entry every session or major feature completion.

| Date   | Phase   | What Was Done                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5/8/26 | Phase 0 | ✅ Initialized project structure with folders and files. Installed client and server dependencies. Set up Tailwind CSS + PostCSS. Created Supabase client initialization files. Built Express health check endpoint. Created landing page with hero section and feature overview. Configured TypeScript, ESLint, Prettier. Updated .env.example files with Supabase configuration. Ready for Phase 1!                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 5/8/26 | Phase 1 | ✅ Seeded 24 CUNY schools into Supabase with full campus data (name, borough, type, enrollment, programs, etc). Built GET /api/schools and GET /api/schools/:id REST endpoints. Created interactive Leaflet map with school markers. Built SchoolMap, SchoolSearch, and SchoolSidebar components. Added search/filter by school name, type, and borough. Implemented stats sidebar showing enrollment, founded year, programs, and website links. Added ExplorePage with full integration. Linked "Explore CUNY" button on landing page to /explore route.                                                                                                                                                                                                                                                              |
| 5/8/26 | Phase 2 | ✅ Integrated Supabase Auth with register and login flows. Created RegisterPage with email validation and minimum 6-char password requirement. Created LoginPage with session restoration and success message on redirect from register. Built AuthContext with useAuth hook managing user, session, loading state, and signUp/signIn/signOut functions. Implemented ProtectedRoute wrapper component for route-level authentication checks. Built DashboardPage as protected landing showing user info and navigation options. Created backend JWT validation middleware to validate Supabase tokens. Built user profile endpoints: GET /api/users/me and PUT /api/users/me with profile update capability. Updated App.tsx with AuthProvider wrapping entire app. Verified all TypeScript compiles without errors.    |
| 5/8/26 | Phase 3 | ✅ Built interactive roadmap builder with React Flow canvas. Created custom node components: CourseNode (with credits/semester), MilestoneNode, ElectiveNode, and CareerGoalNode with editable fields. Implemented RoadmapBuilderPage with full canvas UI including add node, delete node, and connection management. Created backend API endpoints for CRUD operations on roadmaps (POST/GET/PUT/DELETE /api/roadmaps). Built roadmapService for client-side API calls with authentication. Fixed TypeScript strict mode issues with type-only imports. Updated Tailwind CSS 4 configuration for proper PostCSS setup. Added /roadmap protected route to App.tsx and linked from DashboardPage. All code compiles successfully without errors.                                                                         |
| 5/8/26 | Phase 4 | ✅ Built My Journey Dashboard for authenticated users. Created JourneyDashboardPage with roadmap selection, progress calculation (completed/in-progress/planned nodes), and semester timeline view. Built ProgressCard component to display individual progress metrics with animated progress bars. Implemented CreditsTracker with SVG ring chart showing completed vs remaining credits. Created SemesterTimeline component to organize courses by semester with status indicators. Added completion status types (planned, in-progress, completed) to roadmap type definitions. Added /journey protected route to App.tsx and linked from DashboardPage. Updated roadmapService for proper API response handling. All TypeScript compiles successfully. Phase 4 fully functional with all visualization components. |     | 5/9/26 | Phase 5 | ✅ Implemented Phase 5 stretch goals: Responsive mobile layout with collapsible sidebars and hamburger menus for map explorer, roadmap builder, and dashboards. Created DarkModeContext with localStorage persistence and system preference detection. Added DarkModeToggle component to all main pages with dark mode styling (dark:bg-gray-800, dark:text-white, etc) throughout app. Implemented PublicRoadmapPage for read-only shared roadmap viewing at /roadmap/public/:shareId. Created ShareButton component with copy-to-clipboard and native share fallback. Updated all components with Tailwind dark mode classes. Added responsive grid layouts (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4) to handle all screen sizes. Mobile header with toggle buttons for sidebars. All pages compile successfully (344 modules, 819KB). Phase 5 responsive & dark mode features complete. |

---

## 🐛 Known Issues / Notes

> Track bugs, blockers, or decisions made here.

| Issue | Status | Notes |
| ----- | ------ | ----- |
|       |        |       |

---

## 💡 Ideas Parking Lot

> Ideas that came up but aren't in scope yet — save them for stretch goals.

- GPA simulator / what-if tool
- RateMyProfessor integration
- Events/clubs board per campus
- Peer roadmap sharing & discovery feed
- AI-powered course recommendations based on major + interests
