# GoToLinks - Product Requirements Document

## Original Problem Statement
Build a production-ready, full-stack "link-in-bio" application that functions as a micro-website builder for wellness creators. The application allows users to create profiles with links, sections (About, Retreats, Gallery, Video, Testimonials), and customizable themes.

## Architecture

### Tech Stack
- **Frontend**: Next.js 14.2.35 (App Router), React 18, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT + Google OAuth (Emergent Auth)
- **Payments**: Stripe (test mode) - Scaffolded (UI removed for validation mode)
- **File Uploads**: Cloudinary (fully configured)
- **Deployment**: Vercel-ready structure

### Project Structure (Pure Next.js App Router)
```
/app                    # Root project directory
├── app/               # Next.js App Router pages & API routes
│   ├── (auth)/        # Auth pages (login, signup, callback)
│   ├── admin/         # Admin-only pages (feedback)
│   ├── dashboard/     # Dashboard pages (main, profile-editor, analytics)
│   ├── api/           # API routes (auth, blocks, profile, sections, analytics, suggestions, admin)
│   ├── components/    # UI components (SectionEditor, SectionRenderer, ThemeAnimations)
│   └── profile/       # Public profile page with dynamic routing
├── lib/               # Shared utilities (mongodb, auth, themes, sections, cloudinary)
├── .env.local         # Environment variables
└── package.json       # Dependencies
```

## What's Been Implemented

### User Feedback System - FULLY WORKING ✅ (Feb 25, 2026)
- [x] Replaced "Upgrade to Pro" card with "Help Us Improve" feedback card
- [x] Inline suggestion form (no page navigation)
- [x] 500 character limit with counter
- [x] Success message: "Thanks for your suggestion 💛"
- [x] **POST /api/suggestions** - Stores feedback from logged-in users
- [x] Rate limiting (1 request per minute per user)
- [x] Input validation and XSS sanitization
- [x] **GET /api/admin/feedback** - Admin-only endpoint
- [x] **Admin page at /admin/feedback** - Protected table view of all suggestions
- [x] MongoDB collection: `featureSuggestions`

### Validation Mode - Pro Plan UI Removed ✅ (Feb 25, 2026)
- [x] Removed "$19/month" pricing
- [x] Removed "Upgrade to Pro" buttons
- [x] Removed "Most Popular" badge
- [x] Updated headline: "World's FIRST Wellness-Branded Link in Bio — Completely FREE"
- [x] Single pricing card with "$0/forever"
- [x] Removed Pricing link from navbar
- [x] Pro feature code retained internally for future use

### Real-Time Analytics System - FULLY WORKING ✅ (Feb 24, 2026)
- [x] **POST /api/analytics/track** - Tracks profile views and link clicks
- [x] **GET /api/analytics** - Returns aggregated analytics data
- [x] Sparkline charts on main dashboard stat cards
- [x] Real-time stats (views, clicks, change percentages)
- [x] Dedicated analytics page at /dashboard/analytics
- [x] Line chart for Performance Over Time
- [x] Period selector (7D, 30D, 90D)
- [x] Traffic sources breakdown
- [x] Top performing links section

### Cloudinary Integration - FULLY WORKING ✅
- [x] Profile picture upload with Cloudinary
- [x] Background image upload for custom themes
- [x] Signed uploads for security
- [x] Automatic image optimization

### Authentication - FULLY WORKING ✅
- [x] Email signup with password
- [x] Email login
- [x] Session management with cookies
- [x] Google OAuth via Emergent Auth
- [x] Protected dashboard routes
- [x] Logout functionality

### Theme Engine 2.0 - FULLY WORKING ✅
- [x] 8 premium themes with animated backgrounds
- [x] Custom background theme with blur, brightness, overlay controls
- [x] Dynamic font pairings
- [x] Profile image glow aura
- [x] Block animations and styles

### Block Management CRUD - FULLY WORKING ✅
- [x] Create, Read, Update, Delete blocks
- [x] Drag-and-drop reordering with persistence
- [x] Multiple block types (Link, Retreat, Testimonial, Book Call, WhatsApp, Telegram)

### Mini Website Sections System - FULLY WORKING ✅
- [x] 5 Section Types: About Me, Upcoming Event, Image Gallery, YouTube Video, Testimonials
- [x] Drag-and-drop reordering
- [x] Visibility toggle

## API Routes Implemented

### Feedback (New)
- `POST /api/suggestions` - Submit a feature suggestion (logged-in users only)
- `GET /api/admin/feedback` - Get all suggestions (admin-only)

### Analytics
- `POST /api/analytics/track` - Track VIEW or CLICK event
- `GET /api/analytics` - Get aggregated analytics

### Auth
- `POST /api/auth/signup` - Email registration
- `POST /api/auth/login` - Email login
- `POST /api/auth/logout` - Session logout
- `GET /api/auth/me` - Get current user

### Profile
- `GET /api/profile` - Get user's profile
- `PUT /api/profile` - Update profile
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

## Database Schema (MongoDB)

### users
```json
{ _id, email, passwordHash, firstName, lastName, handle, plan, picture, authProvider }
```

### profiles
```json
{ _id, userId, name, headline, bio, photoUrl, location, theme, sections: [...], backgroundImage, backgroundBlur, backgroundBrightness, backgroundOverlayColor }
```

### blocks
```json
{ _id, profileId, type, order, isVisible, title, url, description, ... }
```

### analytics
```json
{ _id, profileId, userId, blockId, eventType, referrer, device, timestamp, createdAt }
```

### featureSuggestions (New)
```json
{ _id, userId, email, suggestion, createdAt }
```

## Completed Tasks (Feb 25, 2026)
1. ✅ Removed Pro Plan UI (pricing, upgrade buttons, badges)
2. ✅ Updated pricing headline to "Completely FREE"
3. ✅ Replaced Upgrade card with "Help Us Improve" feedback card
4. ✅ Implemented inline suggestion form with validation
5. ✅ Created /api/suggestions endpoint with rate limiting
6. ✅ Created admin-only /admin/feedback page
7. ✅ All security measures implemented (auth, sanitization, rate limiting)

## Upcoming Tasks (Priority Order)
1. **Theme Engine 2.0 Dashboard UI (P1)** - Add UI controls for animation styles, block styles, font pairings
2. **Stripe Integration (P2)** - When ready to monetize, re-enable payment flows

## Future/Backlog
- Advanced Analytics (referrer tracking by country, device breakdown charts)
- Custom domains for Pro users
- Social media blocks (Instagram feed, YouTube channel)
- Email notifications for milestone achievements
- Move admin email list to environment variable or database

## Test Credentials
- Admin User: analyticstest@test.com / Test123!
- Normal User: newuser@test.com / Test123!

## Admin Access
Admin emails (can access /admin/feedback):
- admin@gotolinks.com
- localtest@test.com
- analyticstest@test.com

## Technical Notes
- Analytics uses in-memory rate limiting (consider Redis for production)
- Suggestion rate limiting is also in-memory
- XSS sanitization uses basic HTML entity encoding
- Pro feature code retained in codebase but UI removed for validation mode
