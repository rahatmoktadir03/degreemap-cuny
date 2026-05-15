# DegreeMap – CUNY Degree Planning Tool

A comprehensive full-stack degree planning application built for CUNY students. DegreeMap helps students plan their academic roadmap, explore CUNY campuses, track progress, and share their plans with advisors.

## 🎯 Features

### 📍 Campus Explorer

- Interactive map of all CUNY campuses (City College, Hunter, Queens, Brooklyn, etc.)
- Search and filter schools by name
- View campus statistics: location, established year, student population
- Campus details sidebar with advanced filtering and sorting

### 🗺️ Roadmap Builder

- Visual roadmap canvas using React Flow
- Add custom course nodes with:
  - Course title and credits
  - Semester assignment (Fall/Spring/Summer)
  - Status tracking (Planned, In Progress, Completed)
  - Custom notes
- Four node types: Course Node, Milestone Node, Elective Node, Career Goal Node
- Connect nodes to show course prerequisites
- Drag-and-drop canvas with zoom and pan controls
- Save roadmaps to database automatically

### 📊 My Journey Dashboard

- Personal progress tracking dashboard
- Roadmap selection grid with progress previews
- Progress metrics: % completed, % in-progress, % planned
- Credits tracker with circular progress chart
- Semester timeline view with course status breakdown
- Quick navigation to edit roadmaps

### 🔗 Shareable Roadmaps

- Generate unique read-only links to share roadmaps
- Share via native share dialog (mobile) or copy to clipboard
- Public roadmap viewer with full React Flow canvas display
- No authentication required to view shared roadmaps

### 🌙 Dark Mode

- Toggle between light and dark themes
- Persistent preference saved to localStorage
- Respects system dark mode preference on first visit
- Smooth transitions between themes

### 📱 Responsive Design

- Mobile-first approach with Tailwind CSS breakpoints
- Collapsible sidebars on mobile with hamburger toggles
- Responsive grid layouts for all screen sizes
- Touch-friendly navigation

### 🔐 Authentication

- Secure JWT-based authentication with Supabase
- Sign up and login functionality
- Protected routes for authenticated users
- Session persistence

## 🛠 Tech Stack

### Frontend

- **React** 19.2.5 with TypeScript (strict mode)
- **Vite** 8.0.10 for fast development and builds
- **Tailwind CSS** 4.2.4 for responsive styling
- **React Router** 6 for navigation
- **React Flow** 11.11.4 for interactive roadmap canvas
- **Leaflet** 1.9.4 + react-leaflet 5.0.0 for maps
- **Recharts** 3.8.1 for data visualization
- **Axios** for API calls

### Backend

- **Express.js** 4.21.1 with TypeScript
- **Supabase** PostgreSQL database
- **Supabase Auth** JWT-based authentication
- **Node.js** runtime with ES modules

### Database

- **PostgreSQL** (via Supabase)
- Tables: `schools`, `profiles`, `roadmaps`
- Row Level Security (RLS) for data protection

## 📋 Project Structure

```
degreemap-cuny/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── journey/      # Dashboard components
│   │   │   ├── roadmap/      # Builder components
│   │   │   ├── SchoolMap.tsx
│   │   │   ├── SchoolSearch.tsx
│   │   │   ├── DarkModeToggle.tsx
│   │   │   └── ShareButton.tsx
│   │   ├── pages/            # Page components
│   │   │   ├── LandingPage.tsx
│   │   │   ├── ExplorePage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── RoadmapBuilderPage.tsx
│   │   │   ├── JourneyDashboardPage.tsx
│   │   │   └── PublicRoadmapPage.tsx
│   │   ├── services/         # API service calls
│   │   │   ├── schoolService.ts
│   │   │   ├── roadmapService.ts
│   │   │   └── authService.ts
│   │   ├── store/            # Context providers
│   │   │   ├── AuthContext.tsx
│   │   │   └── DarkModeContext.tsx
│   │   ├── types/            # TypeScript type definitions
│   │   └── App.tsx
│   ├── vite.config.ts
│   └── package.json
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── routes/           # API endpoints
│   │   ├── controllers/       # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Authentication, validation
│   │   └── index.ts
│   ├── tsconfig.json
│   └── package.json
│
├── IMPLEMENTATION.md         # Phase-by-phase progress log
├── COPILOT_PROMPT.md        # Project requirements
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Supabase account (free tier available)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd degreemap-cuny
   ```

2. **Install dependencies**

   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**

   Create `.env.local` in `client/`:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_URL=http://localhost:5000
   ```

   Create `.env` in `server/`:

   ```
   PORT=5000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_ANON_KEY=your-anon-key
   NODE_ENV=development
   ```

4. **Set up Supabase database**

   In your Supabase dashboard, run these SQL commands:

   ```sql
   -- Create schools table
   CREATE TABLE schools (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     location TEXT,
     established INTEGER,
     student_population INTEGER,
     website TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Create roadmaps table
   CREATE TABLE roadmaps (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users,
     title TEXT NOT NULL,
     description TEXT,
     nodes JSONB,
     edges JSONB,
     share_id TEXT UNIQUE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Create profiles table
   CREATE TABLE profiles (
     id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
     display_name TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

### Running Locally

1. **Start the backend server**

   ```bash
   cd server
   npm run dev
   ```

   Server runs on `http://localhost:5000`

2. **Start the frontend (in new terminal)**
   ```bash
   cd client
   npm run dev
   ```
   App opens at `http://localhost:5173`

## 📖 Usage

### Creating a Roadmap

1. Log in or sign up
2. Click "New Roadmap" on dashboard
3. Click nodes on the canvas to add courses
4. Drag to create connections between courses
5. Click nodes to edit course details
6. Changes auto-save to database

### Tracking Progress

1. Navigate to "My Journey"
2. Select a roadmap to view
3. Update course status (Complete, In Progress, Planned)
4. View progress metrics and credits tracking
5. Explore your semester timeline

### Sharing a Roadmap

1. On your dashboard, click "Share" on a roadmap
2. Copy the share link
3. Share via messaging, email, or social media
4. Recipients can view without logging in

### Exploring CUNY Campuses

1. Go to "Explore" page
2. View interactive map of CUNY schools
3. Search for specific schools
4. Sort by location, student population, etc.
5. View school details and statistics

## 🔄 API Endpoints

### Schools

- `GET /api/schools` - Get all schools
- `GET /api/schools/:id` - Get school details
- `GET /api/schools/search` - Search schools

### Roadmaps (Protected)

- `GET /api/roadmaps` - Get user's roadmaps
- `POST /api/roadmaps` - Create new roadmap
- `GET /api/roadmaps/:id` - Get roadmap details
- `PUT /api/roadmaps/:id` - Update roadmap
- `DELETE /api/roadmaps/:id` - Delete roadmap
- `GET /api/roadmaps/public/:shareId` - Get public roadmap (no auth required)

### Authentication

- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user

## 🎨 Customization

### Tailwind Configuration

- Colors: Primary (sky) and secondary (teal) with custom shades
- Breakpoints: sm (640px), lg (1024px)
- Dark mode: Class-based strategy using `dark:` prefix

### React Flow Customization

- Custom node types: CourseNode, MilestoneNode, ElectiveNode, CareerGoalNode
- Minimap and controls enabled
- Smooth interactions with mouse events

## 🐛 Troubleshooting

### Build Issues

- Clear `node_modules` and reinstall: `npm ci`
- Clear Vite cache: `rm -rf client/.vite`
- Check TypeScript: `npm run type-check`

### Database Connection

- Verify Supabase credentials in `.env`
- Check RLS policies allow authenticated users
- Ensure tables exist with correct schema

### Dark Mode Not Persisting

- Check browser localStorage is enabled
- Clear localStorage: `localStorage.clear()` in console
- Check `DarkModeContext.tsx` for correct provider wrapping

## 📝 Future Enhancements

- Campus review and rating system
- Advisor view dashboard with student roadmaps
- Email notifications for roadmap updates
- Export roadmap as PDF
- Integration with CUNY registration system
- Mobile native app
- Course recommendation engine

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributors

Created as a CUNY degree planning tool to help students visualize their academic journey.

## 📞 Support

For issues and questions, please open a GitHub issue or contact the development team.

---

**Current Version**: Phase 5 Complete (Responsive + Dark Mode + Shareable Links)
**Last Updated**: May 9, 2026
