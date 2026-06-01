## Deployment checklist

1. Prepare Supabase / Postgres
   - Run SQL migrations: `server/DATABASE_SETUP.sql` and `server/MIGRATION_2026-05-30.sql`.
   - Create a Supabase project and apply migrations (or run via psql).

2. Configure environment variables
   - On the server host (Render/Railway/Heroku): set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, and `FRONTEND_URL`.
   - On the frontend host (Vercel/Netlify): set `VITE_API_URL` to the deployed API base (e.g. `https://api.example.com`).

3. Build & deploy server

   ```bash
   cd server
   npm ci
   npm run build
   # Deploy the built server (platform-specific)
   ```

4. Build & deploy client

   ```bash
   cd client
   npm ci
   VITE_API_URL=https://api.YOURDOMAIN npm run build
   # Deploy `dist` to your static host
   ```

5. Smoke tests
   - Verify `GET /api/health` returns success.
   - Sign up / sign in, create a roadmap, save, and confirm it appears in `GET /api/roadmaps/mine`.

6. Migrate local roadmaps (optional)
   - Open the app while logged in, visit `/migrate`, and run the migration UI (or run the console helper `client/scripts/migrateLocalRoadmaps.js`).

7. Notes
   - CI is configured to build both client and server. Add deployment steps or secrets to GitHub Actions if you want automated deploys.
