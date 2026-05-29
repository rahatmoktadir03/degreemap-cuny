# DegreeMap Client

Modern React TypeScript frontend for DegreeMap CUNY degree planning application.

## Tech Stack

- **React 19** - UI library
- **TypeScript 5.3** - Type safety
- **Vite 5.4** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Supabase** - Backend and authentication
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **shadcn/ui patterns** - Component library patterns

## Project Structure

```
src/
├── components/        # Reusable React components
│   ├── ui/           # shadcn-style UI components
│   ├── journey/      # Journey tracking components
│   ├── roadmap/      # Roadmap builder components
│   └── *.tsx         # Other page components
├── pages/            # Page components (route views)
├── services/         # API and external services
├── store/            # Context providers (Auth, DarkMode)
├── types/            # TypeScript type definitions
├── utils/            # Utility functions and helpers
├── App.tsx           # Main App component with routing
├── main.tsx          # Application entry point
└── index.css         # Global styles and Tailwind directives
```

## Features

### ✅ Implemented

- Light/Dark mode with system preference detection
- Tailwind CSS 4 with custom dark mode selector
- React Router v6 for navigation
- Supabase authentication integration
- Component library structure (button, card, badge, etc.)
- Toast notifications for user feedback
- TypeScript strict mode enabled
- CSS reset and typography defaults

### 🔧 Development

Install dependencies:

```bash
npm install
```

Start dev server (http://localhost:5173):

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Key Components

### Pages

- **LandingPage** - Public entry point with hero, features, CTA
- **LoginPage** - User authentication
- **RegisterPage** - New user signup
- **DashboardPage** - Authenticated user dashboard
- **ExplorePage** - CUNY campus explorer
- **RoadmapBuilderPage** - Create/edit academic roadmaps
- **JourneyDashboardPage** - Track academic progress
- **AdvisorDashboardPage** - Advisor tools

### Context Providers

- **AuthContext** - Supabase authentication state
- **DarkModeContext** - Dark mode toggle and persistence

### Services

- **supabase.ts** - Supabase client initialization
- **authService.ts** - Authentication operations
- **roadmapService.ts** - Roadmap CRUD operations
- **schoolsService.ts** - Campus/school data

## Tailwind CSS 4 Setup

This project uses Tailwind CSS 4 with the new syntax:

```css
@import "tailwindcss/preflight";
@tailwind utilities;
```

Dark mode is configured as a selector (class-based):

```html
<html class="dark"></html>
```

## Environment Variables

Required variables in `.env`:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)

## Dark Mode

Dark mode is managed through `DarkModeContext`:

- Detects system preference on first load
- Persists preference to localStorage
- Applies `dark` class to `<html>` element
- All components use Tailwind dark: prefix for dark mode styles

To use dark mode in components:

```tsx
<div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Content</div>
```

## Build and Deployment

The app is built with Vite for optimal performance:

```bash
npm run build
```

This generates an optimized `dist/` folder ready for deployment to any static hosting service.

## TypeScript Configuration

Strict mode is enabled for type safety:

- `noUnusedLocals` - Error on unused variables
- `noUnusedParameters` - Error on unused function parameters
- `noFallthroughCasesInSwitch` - Error on missing switch cases

Path alias `@/` is configured to resolve to `./src/`.

## Notes

- All frontend tools (icons, components, notifications) are integrated
- Functionality preserved from original build
- Modern CSS practices with Tailwind v4
- Clean component structure for maintainability
