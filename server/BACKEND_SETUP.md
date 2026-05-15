# DegreeMap Backend Setup Guide

## Current Status

✅ Backend API server implemented with Express.js
✅ Supabase integration configured
✅ Auth endpoints created (/api/auth/register, /api/auth/login)
⏳ Database tables need to be created

## Quick Start

### 1. Set Up Database Tables

The database tables must be created in Supabase. Run the SQL from `DATABASE_SETUP.sql` in your Supabase SQL Editor:

1. Go to: https://app.supabase.com/project/nykllsgjhaezdwvkdhzx/sql/new
2. Copy-paste the contents of `DATABASE_SETUP.sql`
3. Click "Run" to execute all the SQL commands
4. Verify tables were created by checking the "Tables" section in Supabase

### 2. Start the Backend Server

```bash
cd server
node dist/index.js
```

The server will start on http://localhost:5000

### 3. Test the API

#### Health Check

```bash
curl http://localhost:5000/api/health
```

#### Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

#### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

## Architecture

### Authentication Flow

1. User registers/logs in via frontend
2. Frontend calls Supabase Auth directly (or backend auth endpoint)
3. Supabase returns JWT token
4. Frontend stores token in localStorage
5. Frontend includes token in `Authorization: Bearer <token>` header for protected API calls
6. Backend verifies token with Supabase admin client
7. Backend allows request if token is valid

### API Endpoints

#### Public Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/schools` - Get list of CUNY schools

#### Protected Endpoints (require Authorization header)

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/roadmaps` - Get user's roadmaps
- `POST /api/roadmaps` - Create new roadmap
- `PUT /api/roadmaps/:id` - Update roadmap
- `DELETE /api/roadmaps/:id` - Delete roadmap
- `GET /api/advisor/*` - Advisor dashboard endpoints

## Environment Variables

Required `.env` file in server directory:

```
SUPABASE_URL=https://nykllsgjhaezdwvkdhzx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=5000
```

## Database Schema

### Tables Created

1. **profiles** - User profile information
2. **roadmaps** - Academic roadmaps created by users
3. **journey_milestones** - User progress milestones
4. **campus_reviews** - User reviews of CUNY campuses
5. **schools** - Pre-populated CUNY school data (from seed)

## Troubleshooting

### "Database error creating new user"

- **Cause**: profiles table doesn't exist in Supabase
- **Solution**: Run the SQL from `DATABASE_SETUP.sql` in Supabase SQL Editor

### "Invalid or expired token"

- **Cause**: Authorization header is missing or token is invalid
- **Solution**: Make sure to include `Authorization: Bearer <token>` header with valid JWT from Supabase

### Server won't start

- **Cause**: TypeScript ES module issue with ts-node
- **Solution**: Use compiled JavaScript: `node dist/index.js`

## Development

### Build TypeScript

```bash
npm run build
```

### Run in Development Mode

```bash
npm run dev
```

(Note: May have ES module issues; use `node dist/index.js` instead)

### Seed Schools Data

```bash
npm run seed
```

## Next Steps

1. ✅ Run `DATABASE_SETUP.sql` in Supabase
2. ✅ Verify server is running on port 5000
3. ✅ Test auth endpoints with curl or Postman
4. ✅ Test frontend integration with backend
5. ⏳ Implement additional endpoints as needed (roadmaps CRUD, advisor endpoints)
6. ⏳ Add input validation and error handling
7. ⏳ Deploy to production (Render.com for backend)
