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

## What's Been Implemented

### Authentication - FULLY WORKING ✅
- [x] Email signup with password
- [x] Email login
- [x] Session management with cookies
- [x] Google OAuth via Emergent Auth
- [x] Protected dashboard route
- [x] Logout functionality

### Theme System - FULLY WORKING ✅ (Feb 2026)
- [x] 8 premium themes defined in `/lib/themes.ts`
- [x] `PATCH /api/profile/theme` endpoint for saving themes
- [x] Theme carousel with no scroll reset bug
- [x] Live preview in profile editor updates instantly
- [x] Public profile dynamically applies saved theme
- [x] Themes: zen-minimal, sacred-earth, ocean-temple, forest-calm, sunset-glow, lavender-dreams, midnight-bloom, rose-quartz

### API Routes Implemented (MongoDB Backend)
- `POST /api/auth/signup` - Email registration ✅
- `POST /api/auth/login` - Email login ✅
- `POST /api/auth/logout` - Session logout ✅
- `GET /api/auth/me` - Get current user ✅
- `POST /api/auth/google` - Google OAuth callback ✅
- `GET /api/profile` - Get user's profile ✅
- `PUT /api/profile` - Update profile ✅
- `PATCH /api/profile/theme` - Update theme ✅
- `GET /api/profile/[handle]` - Get public profile ✅
- `GET /api/analytics` - Get analytics ✅

## Test Credentials
- Email: test@example.com
- Password: password123
- Handle: testuser

## Completed Tasks
1. ✅ Migrate from Vite to Next.js
2. ✅ Implement authentication (JWT + Google OAuth)
3. ✅ Fix theme selection system with database persistence
4. ✅ Add live theme preview in dashboard

## Next Tasks (Priority Order)
1. Complete blocks CRUD API (MongoDB) - add, edit, delete blocks
2. Profile editor form functionality - save name, headline, bio, location
3. Test Stripe payment flow
4. Add Cloudinary image uploads
5. Migrate to Supabase when credentials provided
6. Deploy to Vercel

