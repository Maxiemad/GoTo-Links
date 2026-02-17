# GoToLinks - Product Requirements Document

## Original Problem Statement
Migrate GoToLinks from Vite + React to Next.js 14 App Router with full backend implementation:
1. Set up the project and ensure it runs locally
2. Migrate fully to Next.js (remove Vite)
3. Implement backend APIs for Authentication, Profiles, Blocks, Analytics
4. Integrate Supabase (PostgreSQL) with Prisma
5. Implement Stripe (test mode) for Pro plan
6. Add Cloudinary for file uploads
7. Structure for Vercel deployment

**USER CONSTRAINT: UI is locked. Backend changes only. No visual changes allowed.**

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18 - **ORIGINAL UI PRESERVED**
- **Backend**: FastAPI proxy + Next.js API Routes
- **Database**: MongoDB (local) - can be swapped for Supabase later
- **Authentication**: JWT + Google OAuth (Emergent Auth) - **WORKING**
- **Payments**: Stripe (test mode)
- **File Uploads**: Cloudinary (scaffolded)
- **Deployment**: Vercel-ready structure

## What's Been Implemented (Jan 2026)

### Authentication - FULLY WORKING ✅
- [x] Email signup with password
- [x] Email login
- [x] Session management with cookies
- [x] Google OAuth via Emergent Auth
- [x] Protected dashboard route
- [x] Logout functionality

### API Routes Implemented (MongoDB Backend)
- `POST /api/auth/signup` - Email registration ✅
- `POST /api/auth/login` - Email login ✅
- `POST /api/auth/logout` - Session logout ✅
- `GET /api/auth/me` - Get current user ✅
- `POST /api/auth/google` - Google OAuth callback ✅
- `GET /api/profile` - Get user's profile ✅
- `PUT /api/profile` - Update profile
- `GET /api/profile/[handle]` - Get public profile ✅
- `GET /api/analytics` - Get analytics ✅

## Test Credentials
- Email: test@example.com
- Password: password123

## Next Tasks
1. Complete blocks CRUD API (MongoDB)
2. Test Stripe payment flow
3. Add Cloudinary image uploads
4. Migrate to Supabase when credentials provided
5. Deploy to Vercel
