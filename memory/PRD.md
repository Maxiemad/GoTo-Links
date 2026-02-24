# GoToLinks - Product Requirements Document

## Original Problem Statement
Build a production-ready, full-stack "link-in-bio" application that functions as a micro-website builder for wellness creators. The application allows users to create profiles with links, sections (About, Retreats, Gallery, Video, Testimonials), and customizable themes.

## Architecture

### Tech Stack
- **Frontend**: Next.js 14.2.35 (App Router), React 18, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT + Google OAuth (Emergent Auth)
- **Payments**: Stripe (test mode) - Scaffolded
- **File Uploads**: Cloudinary (fully configured)
- **Deployment**: Vercel-ready structure

### Project Structure (Pure Next.js App Router)
```
/app                    # Root project directory
├── app/               # Next.js App Router pages & API routes
│   ├── (auth)/        # Auth pages (login, signup, callback)
│   ├── dashboard/     # Dashboard pages (main, profile-editor, analytics, upgrade)
│   ├── api/           # API routes (auth, blocks, profile, sections, analytics, upload)
│   ├── components/    # UI components (SectionEditor, SectionRenderer, ThemeAnimations)
│   └── profile/       # Public profile page with dynamic routing
├── lib/               # Shared utilities (mongodb, auth, themes, sections, cloudinary)
├── .env.local         # Environment variables
└── package.json       # Dependencies
```

## What's Been Implemented

### Real-Time Analytics System - FULLY WORKING ✅ (Feb 24, 2026)
- [x] **POST /api/analytics/track** - Tracks profile views and link clicks
- [x] **GET /api/analytics** - Returns aggregated analytics data
- [x] **Sparkline charts** on main dashboard stat cards
- [x] **Real-time stats** replacing static data (views, clicks, change percentages)
- [x] **Dedicated analytics page** at /dashboard/analytics
- [x] **Line chart** for Performance Over Time
- [x] **Period selector** (7D, 30D, 90D) with header fallback for proxy environments
- [x] **Traffic sources breakdown** (Instagram, Google, Twitter/X, Direct, etc.)
- [x] **Top performing links** section
- [x] **Public profile tracking** - Views tracked on page load
- [x] **Link click tracking** - Clicks tracked when users click blocks
- [x] **Rate limiting** - In-memory rate limiting to prevent spam
- [x] **Referrer parsing** - Detects source (Instagram, Facebook, Google, etc.)
- [x] **Device detection** - Mobile, Tablet, Desktop

### Cloudinary Integration - FULLY WORKING ✅ (Feb 24, 2026)
- [x] Profile picture upload with Cloudinary
- [x] Background image upload for custom themes
- [x] Signed uploads for security
- [x] Automatic image optimization
- [x] Fallback to base64 if Cloudinary unavailable

### Authentication - FULLY WORKING ✅
- [x] Email signup with password
- [x] Email login
- [x] Session management with cookies
- [x] Google OAuth via Emergent Auth
- [x] Protected dashboard routes
- [x] Logout functionality

### Theme Engine 2.0 - FULLY WORKING ✅
- [x] 8 premium themes with animated backgrounds
- [x] Dynamic font pairings
- [x] Profile image glow aura
- [x] Block animations (fadeUp, slideIn, staggeredAppear, etc.)
- [x] Block styles (glassmorphism, gradient-pill, soft-shadow, etc.)
- [x] Theme carousel in dashboard with instant preview
- [x] Custom background theme with blur, brightness, overlay controls

### Block Management CRUD - FULLY WORKING ✅
- [x] Create blocks (Link, Retreat, Testimonial, Book Call, WhatsApp, Telegram)
- [x] Read, Update, Delete blocks
- [x] Reorder blocks with persistence
- [x] Dashboard UI with reorder buttons
- [x] Public profile renders blocks dynamically

### Mini Website Sections System - FULLY WORKING ✅
- [x] **Dashboard Section Editor UI** with tabbed navigation
- [x] **5 Section Types**: About Me, Upcoming Event, Image Gallery, YouTube Video, Testimonials
- [x] **Drag-and-drop reordering**
- [x] **Visibility toggle**
- [x] **API endpoints**: GET/POST/PUT/DELETE `/api/sections`

### Dashboard Features - FULLY WORKING ✅
- [x] 3D Tilt cards with glassmorphism
- [x] Wellness-themed light mode design
- [x] Profile URL copier with toast
- [x] Time-aware greeting
- [x] Four action cards: Edit Profile, Preview Profile, Analytics, Upgrade
- [x] Stats cards with sparklines (Profile Views, Link Clicks, Top Performer)

## API Routes Implemented

### Analytics (New)
- `POST /api/analytics/track` - Track VIEW or CLICK event
- `GET /api/analytics` - Get aggregated analytics (stats, sparklines, daily breakdown, top links, referrers)

### Auth
- `POST /api/auth/signup` - Email registration
- `POST /api/auth/login` - Email login
- `POST /api/auth/logout` - Session logout
- `GET /api/auth/me` - Get current user

### Profile
- `GET /api/profile` - Get user's profile with blocks and sections
- `PUT /api/profile` - Update profile
- `PATCH /api/profile/theme` - Update theme
- `GET /api/profile/[handle]` - Get public profile

### Blocks
- `GET /api/blocks` - Get all user's blocks
- `POST /api/blocks` - Create new block
- `PUT /api/blocks/[id]` - Update block
- `DELETE /api/blocks/[id]` - Delete block
- `POST /api/blocks/reorder` - Reorder blocks

### Sections
- `GET /api/sections` - Get all user's sections
- `POST /api/sections` - Create new section
- `PUT /api/sections` - Update section
- `DELETE /api/sections` - Delete section
- `POST /api/sections/reorder` - Reorder sections

### Upload
- `GET /api/upload/signature` - Get Cloudinary upload signature

## Database Schema (MongoDB)

### users
```json
{ _id, email, passwordHash, firstName, lastName, handle, plan, picture, authProvider }
```

### profiles
```json
{ _id, userId, name, headline, bio, photoUrl, location, theme, sections: [...], backgroundImage, backgroundBlur, backgroundBrightness, backgroundOverlayColor }
```

### blocks (separate collection)
```json
{ _id, profileId, type, order, isVisible, title, url, description, ... }
```

### analytics (new collection)
```json
{ _id, profileId, userId, blockId, eventType, referrer, device, rawReferrer, userAgent, clientIp, timestamp, createdAt }
```

## Completed Tasks (Feb 24, 2026)
1. ✅ Real-Time Analytics System - Fully implemented and tested
2. ✅ Dashboard sparklines and real stats
3. ✅ Analytics page with charts and period selector
4. ✅ Cloudinary credentials configured
5. ✅ Period selector fixed with header fallback

## Upcoming Tasks (Priority Order)
1. **Theme Engine 2.0 Dashboard UI (P1)** - Add UI controls for animation styles, block styles, font pairings
2. **Stripe Integration (P2)** - Payment flows for Pro plan

## Future/Backlog
- Advanced Analytics (referrer tracking by country, device breakdown charts)
- Custom domains for Pro users
- Social media blocks (Instagram feed, YouTube channel)
- Email notifications
- Team/collaboration features

## Test Credentials
- Email: analyticstest@test.com
- Password: Test123!
- Handle: analyticstester

## Technical Notes
- Analytics uses in-memory rate limiting (consider Redis for production scale)
- Period selector uses x-analytics-period header as fallback for proxy environments that strip query params
- Public profile tracking fires on page load using useEffect
- Link click tracking fires on block click handlers
