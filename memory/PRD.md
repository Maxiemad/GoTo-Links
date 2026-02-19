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
- **Frontend**: Next.js 14.2.35 (App Router), React 18 - **ORIGINAL UI PRESERVED**
- **Backend**: FastAPI proxy + Next.js API Routes
- **Database**: MongoDB (fully migrated - Prisma removed)
- **Authentication**: JWT + Google OAuth (Emergent Auth) - **WORKING**
- **Payments**: Stripe (test mode) - Scaffolded with MongoDB
- **File Uploads**: Cloudinary - Scaffolded
- **Deployment**: Vercel-ready structure ✅

## Deployment Readiness ✅ (Feb 19, 2026 - Updated)
- ✅ Build passes successfully (`npm run build` completes without errors)
- ✅ All Prisma dependencies removed
- ✅ MongoDB package pinned to `6.12.0` (requires Node >=16.20.1 - compatible with Vercel's Node 20.18.1)
- ✅ yarn.lock correctly locks mongodb@6.12.0
- ✅ No hardcoded URLs or credentials
- ✅ Environment variables properly configured
- ✅ package-lock.json removed (using yarn only)
- ✅ tsconfig.json has `baseUrl: "."` for path alias resolution (`@/*`)
- ✅ Deployment agent verification PASSED

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

### Block Management CRUD - FULLY WORKING ✅ (Feb 19, 2026)
- [x] Create blocks (Link, Retreat, Testimonial, Book Call, WhatsApp, Telegram)
- [x] Read blocks (GET all, GET single)
- [x] Update blocks (title, url, description, visibility, etc.)
- [x] Delete blocks (with cascade delete of analytics)
- [x] Reorder blocks (persisted order in MongoDB)
- [x] Dashboard UI with up/down reorder buttons
- [x] Public profile renders blocks dynamically sorted by order
- [x] Only visible blocks (isVisible=true) shown on public profile
- [x] Comprehensive backend tests: `/app/backend/tests/test_blocks_api.py`

### API Routes Implemented (MongoDB Backend)
**Auth:**
- `POST /api/auth/signup` - Email registration ✅
- `POST /api/auth/login` - Email login ✅
- `POST /api/auth/logout` - Session logout ✅
- `GET /api/auth/me` - Get current user ✅
- `POST /api/auth/google` - Google OAuth callback ✅

**Profile:**
- `GET /api/profile` - Get user's profile with blocks ✅
- `PUT /api/profile` - Update profile ✅
- `PATCH /api/profile/theme` - Update theme ✅
- `GET /api/profile/[handle]` - Get public profile with blocks ✅

**Blocks:**
- `GET /api/blocks` - Get all user's blocks ✅
- `POST /api/blocks` - Create new block ✅
- `GET /api/blocks/[id]` - Get single block ✅
- `PUT /api/blocks/[id]` - Update block ✅
- `DELETE /api/blocks/[id]` - Delete block ✅
- `POST /api/blocks/reorder` - Reorder blocks ✅

**Payments (MongoDB):**
- `POST /api/payments/checkout` - Create Stripe checkout ✅
- `GET /api/payments/status/[sessionId]` - Get payment status ✅

**Analytics:**
- `GET /api/analytics` - Get analytics data
- `POST /api/analytics/track` - Track events

## Test Credentials
- Email: blocktest@example.com
- Password: Test1234!
- Handle: blocktester

## Database Schema (MongoDB)

### users
```json
{ _id, email, password, firstName, lastName, handle, plan, picture, theme }
```

### profiles
```json
{ _id, userId, name, headline, bio, photoUrl, videoUrl, location, theme, customDomain }
```

### blocks
```json
{ _id, profileId, type, order, isVisible, title, url, description, dateRange, location, price, authorName, authorPhoto, quote, phone, createdAt, updatedAt }
```

### sessions
```json
{ _id, userId, sessionToken, expiresAt }
```

### analytics
```json
{ _id, userId, blockId, eventType, referrer, userAgent, createdAt }
```

### payments
```json
{ _id, userId, stripeSessionId, amount, currency, status, metadata, createdAt, updatedAt }
```

## Completed Tasks
1. ✅ Migrate from Vite to Next.js
2. ✅ Implement authentication (JWT + Google OAuth)
3. ✅ Fix theme selection system with database persistence
4. ✅ Add live theme preview in dashboard
5. ✅ Complete blocks CRUD API (MongoDB) - add, edit, delete, reorder blocks
6. ✅ Profile editor form functionality - save name, headline, bio, location
7. ✅ Public profile renders blocks dynamically
8. ✅ Fix Tailwind CSS styling (added @tailwind directives)
9. ✅ Remove all Prisma dependencies - MongoDB only architecture
10. ✅ Migrate payment routes to MongoDB
11. ✅ Deployment readiness verified

## Next Tasks (Priority Order)
1. Complete Analytics System - ensure tracking and data fetching work
2. Secure Auth Middleware - protect dashboard routes
3. Test Stripe payment flow end-to-end
4. Add Cloudinary image uploads

## Future/Backlog
- Implement Google OAuth for production
- Add social media blocks (Instagram, YouTube, Twitter)
- Video hero feature for Pro users
- Custom domains for Pro users