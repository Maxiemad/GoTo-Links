# GoToLinks - Product Requirements Document

## Original Problem Statement
Build a production-ready, full-stack "link-in-bio" application that functions as a micro-website builder for wellness creators. The application allows users to create profiles with links, sections (About, Retreats, Gallery, Video, Testimonials), and customizable themes.

## Current Mode: Validation Mode
We are collecting real user demand before launching the paid version. Users should feel heard, and admins should collect structured data about desired premium features.

## Architecture

### Tech Stack
- **Frontend**: Next.js 14.2.35 (App Router), React 18, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT + Google OAuth (Emergent Auth)
- **Payments**: Stripe (test mode) - Scaffolded, UI in validation mode
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
│   ├── components/    # UI components
│   └── profile/       # Public profile page with dynamic routing
├── lib/               # Shared utilities (mongodb, auth, themes, sections, cloudinary)
├── .env.local         # Environment variables
└── package.json       # Dependencies
```

## What's Been Implemented

### Validation Mode - Two-Card Pricing Layout ✅ (Feb 25, 2026)
**Pricing Section:**
- Headline: "World's FIRST Wellness-Branded Link in Bio"
- Subtitle: "Completely FREE — No credit card required"

**Free Card ($0):**
- Unlimited links
- Retreat blocks
- Basic themes
- Profile analytics
- CTA: "Get started free" button

**Pro Card ($10/month):**
- "Most Popular" badge
- Everything in Free
- Video hero backgrounds
- All premium themes
- Advanced analytics
- Custom domain
- Priority support
- CTA: "Shape the Premium Version" title
- Subtitle: "Tell us what you'd love in the $10/month plan."
- Button: "Suggest Features" (expands inline form)

### User Feedback System - FULLY WORKING ✅ (Feb 25, 2026)
**Dashboard Feedback Card:**
- "Help Us Improve" title
- "Suggest features you'd love to see next." subtitle
- "Suggest Features" button → inline form
- 500 character limit with counter
- Success message: "Thanks for your suggestion 💛"
- Stored with `source: 'dashboard'`

**Pricing Page Feedback:**
- Inline suggestion form in Pro card
- Placeholder: "What features would make this worth $10/month for you?"
- Success message: "Thanks for helping shape the premium version 💛"
- Stored with `source: 'pricing_page'`

**Admin Features:**
- `/admin/feedback` page shows all suggestions
- Table with User Email, Suggestion, Date, Source columns
- Source badges: "Pricing" (amber) vs "Dashboard" (brown)
- Protected: Admin-only access

### Real-Time Analytics System - FULLY WORKING ✅
- POST /api/analytics/track - Tracks profile views and link clicks
- GET /api/analytics - Returns aggregated analytics data
- Sparkline charts on dashboard stat cards
- Dedicated analytics page at /dashboard/analytics
- Period selector (7D, 30D, 90D)

### Cloudinary Integration - FULLY WORKING ✅
- Profile picture upload
- Background image upload for custom themes
- Signed uploads for security

### Authentication - FULLY WORKING ✅
- Email signup/login
- Google OAuth via Emergent Auth
- Session management with cookies
- Protected dashboard routes

### Theme Engine 2.0 - FULLY WORKING ✅
- 8 premium themes with animated backgrounds
- Custom background theme with blur, brightness, overlay controls
- Dynamic font pairings

### Block Management CRUD - FULLY WORKING ✅
- Create, Read, Update, Delete blocks
- Drag-and-drop reordering with persistence
- Multiple block types

### Mini Website Sections System - FULLY WORKING ✅
- 5 Section Types
- Drag-and-drop reordering
- Visibility toggle

## API Routes

### Feedback
- `POST /api/suggestions` - Submit suggestion (accepts `source` field: 'dashboard' | 'pricing_page')
- `GET /api/admin/feedback` - Get all suggestions with source (admin-only)

### Analytics
- `POST /api/analytics/track` - Track VIEW or CLICK event
- `GET /api/analytics` - Get aggregated analytics

### Auth, Profile, Blocks, Sections
- Full CRUD operations as documented previously

## Database Schema (MongoDB)

### featureSuggestions
```json
{
  _id: ObjectId,
  userId: string,
  email: string,
  suggestion: string,
  source: "dashboard" | "pricing_page",
  createdAt: Date
}
```

## Completed Tasks (Feb 25, 2026)
1. ✅ Restored two-card pricing layout (Free + Pro)
2. ✅ Changed Pro price from $19 to $10/month
3. ✅ Kept "Most Popular" badge on Pro card
4. ✅ Replaced Pro CTA with collaborative validation approach
5. ✅ Added inline suggestion form to Pro card
6. ✅ Added source field to suggestions API
7. ✅ Added Source column to admin feedback page

## Upcoming Tasks (Priority Order)
1. **Theme Engine 2.0 Dashboard UI (P1)** - Add UI controls for animation styles, block styles, font pairings
2. **Stripe Integration (P2)** - When ready to monetize, implement payment flows

## Future/Backlog
- Advanced Analytics (country breakdown, device charts)
- Custom domains for Pro users
- Social media blocks integration
- Email notifications for milestone achievements
- Move admin email list to environment variable

## Test Credentials
- Admin User: analyticstest@test.com / Test123!
- Normal User: newuser@test.com / Test123!

## Admin Access
Admin emails (can access /admin/feedback):
- admin@gotolinks.com
- localtest@test.com
- analyticstest@test.com

## Technical Notes
- Analytics uses in-memory rate limiting
- Suggestion rate limiting is also in-memory
- XSS sanitization uses HTML entity encoding
- Pro feature code retained in codebase
- Source field distinguishes feedback origin
