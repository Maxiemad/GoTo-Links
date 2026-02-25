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

### Project Structure
```
/app                    # Root project directory
├── app/               # Next.js App Router pages & API routes
│   ├── (auth)/        # Auth pages (login, signup, callback)
│   ├── admin/         # Admin dashboard (protected by domain check)
│   ├── dashboard/     # User dashboard pages
│   ├── api/           # API routes
│   │   ├── admin/     # Admin-only APIs (stats, users, feedback)
│   │   ├── auth/      # Auth endpoints
│   │   ├── analytics/ # Analytics tracking
│   │   └── ...
│   ├── components/    # UI components
│   └── profile/       # Public profile page
├── lib/               # Shared utilities
└── package.json       # Dependencies
```

## What's Been Implemented

### Admin System - FULLY WORKING ✅ (Feb 25, 2026)
**Domain-Based Access Control:**
- Admin access granted ONLY if email ends with `@gotoretreats.com`
- Server-side validation in all admin APIs via `isAdminEmail()` function
- Non-admin users redirected to homepage when accessing `/admin`
- Admin link completely hidden from non-admin users in navbar

**Admin Dashboard (`/admin`):**
- **Overview Tab**: Platform metrics (Total Users, Total Profiles, New Users 7d, Total Views, Total Clicks, Feature Suggestions)
- **Users Tab**: Searchable user list with columns (Name, Email, Handle, Profile URL, Date Joined)
- **Suggestions Tab**: Filterable suggestions (All, Dashboard, Pricing Page) with source badges

**Admin APIs:**
- `GET /api/admin/stats` - Platform-wide metrics
- `GET /api/admin/users?search=` - User list with search
- `GET /api/admin/feedback?source=` - Suggestions with filter

**Security:**
- All admin APIs validate `isAdminEmail(user.email)` server-side
- Non-admin users get 403 Access denied
- No database IDs exposed
- Input sanitization on suggestions

### Validation Mode - Two-Card Pricing Layout ✅ (Feb 25, 2026)
**Free Card ($0):**
- Unlimited links, Retreat blocks, Basic themes, Profile analytics
- CTA: "Get started free"

**Pro Card ($10/month):**
- "Most Popular" badge
- All features listed
- CTA: "Shape the Premium Version" → inline suggestion form

### User Feedback System ✅ (Feb 25, 2026)
- Dashboard: "Help Us Improve" card with inline form
- Pricing Page: Pro card with inline suggestion form
- 500 character limit, success messages
- Source tracking: `dashboard` vs `pricing_page`

### Real-Time Analytics System ✅
- Profile views and link clicks tracking
- Sparkline charts on dashboard
- Dedicated analytics page with period selector

### Authentication ✅
- Email signup/login
- Google OAuth via Emergent Auth
- Session management with cookies
- `isAdmin` flag based on email domain

### Theme Engine 2.0 ✅
- 8 premium themes with animated backgrounds
- Custom background theme
- Dynamic font pairings

### Block & Section Management ✅
- Full CRUD operations
- Drag-and-drop reordering
- Multiple block/section types

## API Routes

### Admin (Protected)
- `GET /api/admin/stats` - Platform overview metrics
- `GET /api/admin/users` - Users list (supports `?search=`)
- `GET /api/admin/feedback` - Suggestions (supports `?source=`)

### Auth
- `POST /api/auth/signup` - Registration
- `POST /api/auth/login` - Login (returns `isAdmin`)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user (returns `isAdmin`)

### Feedback
- `POST /api/suggestions` - Submit suggestion (accepts `source` field)

### Analytics, Profile, Blocks, Sections
- Full CRUD as documented previously

## Database Schema

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

### users
```json
{ _id, email, passwordHash, firstName, lastName, handle, plan, picture, authProvider, createdAt }
```

## Completed Tasks (Feb 25, 2026)
1. ✅ Admin system with domain-based access (@gotoretreats.com)
2. ✅ Admin dashboard with Overview, Users, Suggestions tabs
3. ✅ Server-side protection for all admin routes
4. ✅ Admin link hidden from non-admin users
5. ✅ Fixed isAdmin missing in login response

## Upcoming Tasks
1. **Theme Engine 2.0 Dashboard UI (P1)** - Add UI controls for animation styles, block styles, font pairings
2. **Stripe Integration (P2)** - When ready to monetize

## Future/Backlog
- Advanced Analytics (country, device breakdown)
- Custom domains for Pro users
- Social media blocks integration
- Email notifications

## Test Credentials
- **Admin User**: admin@gotoretreats.com / Admin123!
- **Normal User**: analyticstest@test.com / Test123!

## Admin Access
Only emails ending with `@gotoretreats.com` have admin access.
Admins can view:
- All users and their profile URLs
- All feature suggestions
- Platform-wide metrics

Normal users cannot see or access the admin panel.
