# GoToLinks - Product Requirements Document

## Original Problem Statement
Build a production-ready, full-stack "link-in-bio" application that functions as a micro-website builder for wellness creators. The application allows users to create profiles with links, sections (About, Retreats, Gallery, Video, Testimonials), and customizable themes.

## Architecture

### Tech Stack
- **Frontend**: Next.js 14.2.35 (App Router), React 18, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes + FastAPI proxy (local dev only)
- **Database**: MongoDB
- **Authentication**: JWT + Google OAuth (Emergent Auth)
- **Payments**: Stripe (test mode) - Scaffolded
- **File Uploads**: Cloudinary - Scaffolded
- **Deployment**: Vercel-ready structure

### Project Structure (Pure Next.js App Router)
```
/app                    # Root project directory
├── app/               # Next.js App Router pages & API routes
│   ├── (auth)/        # Auth pages (login, signup, callback)
│   ├── dashboard/     # Dashboard pages (main, profile-editor, upgrade)
│   ├── api/           # API routes (auth, blocks, profile, sections)
│   ├── components/    # UI components (SectionEditor, SectionRenderer, ThemeAnimations)
│   └── profile/       # Public profile page with dynamic routing
├── lib/               # Shared utilities (mongodb, auth, themes, sections)
├── .env.local         # Environment variables
└── package.json       # Dependencies
```

## What's Been Implemented

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
- [x] Themes: zen-minimal, sacred-earth, ocean-temple, forest-calm, sunset-glow, lavender-dreams, midnight-bloom, rose-quartz

### Block Management CRUD - FULLY WORKING ✅
- [x] Create blocks (Link, Retreat, Testimonial, Book Call, WhatsApp, Telegram)
- [x] Read, Update, Delete blocks
- [x] Reorder blocks with persistence
- [x] Dashboard UI with reorder buttons
- [x] Public profile renders blocks dynamically

### Mini Website Sections System - FULLY WORKING ✅ (Feb 20, 2026)
- [x] **Dashboard Section Editor UI** with tabbed navigation (Profile Info, Link Blocks, Mini Website)
- [x] **5 Section Types**: About Me, Upcoming Event, Image Gallery, YouTube Video, Testimonials
- [x] **Rich inline editing** with dedicated forms for each section type
- [x] **Drag-and-drop reordering** via GripVertical handle
- [x] **Visibility toggle** (eye icon) to show/hide sections
- [x] **Edit/Delete controls** for each section
- [x] **Real-time rendering** on public profile
- [x] **API endpoints**: GET/POST/PUT/DELETE `/api/sections`, POST `/api/sections/reorder`
- [x] **100% test coverage** - All 20 backend tests passing

#### Section Types Detail:
1. **About Me** - Expandable card with title, description, optional highlight quote
2. **Upcoming Event** - Event card with title, location, date, countdown timer, CTA button
3. **Image Gallery** - Slider or grid layout with lightbox support
4. **YouTube Video** - Embedded video with lazy loading play button
5. **Testimonials** - Auto-sliding carousel with ratings

## API Routes Implemented

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
- `PUT /api/sections` - Update section (data, visibility)
- `DELETE /api/sections` - Delete section
- `POST /api/sections/reorder` - Reorder sections

## Database Schema (MongoDB)

### users
```json
{ _id, email, passwordHash, firstName, lastName, handle, plan, picture, authProvider }
```

### profiles
```json
{ _id, userId, name, headline, bio, photoUrl, location, theme, sections: [...] }
```

### sections (embedded in profiles)
```json
{ id, type, data, order, enabled, createdAt, updatedAt }
```

### blocks (separate collection)
```json
{ _id, profileId, type, order, isVisible, title, url, description, ... }
```

## Test Credentials
- Email: test@example.com
- Password: Test1234!
- Handle: testuser

## Completed Tasks
1. ✅ Next.js 14 App Router setup
2. ✅ Authentication (JWT + Google OAuth)
3. ✅ Theme Engine 2.0 with animations
4. ✅ Block CRUD with reordering
5. ✅ **Mini Website Sections System (Dashboard UI)** - Feb 20, 2026
6. ✅ Profile editor with tabbed navigation
7. ✅ Public profile with themed rendering
8. ✅ Deployment readiness
9. ✅ **Production Auth Fix** - Environment-aware cookie security (Feb 20, 2026)
10. ✅ **3D Effects System** - Added premium 3D depth effects (Feb 20, 2026)

### 3D Effects Implementation (Feb 20, 2026)
- [x] Created comprehensive 3D CSS keyframes in `globals.css` (15+ animations)
- [x] `Tilt3DCard` component with perspective tilt on hover + glare effect
- [x] `DepthGlow` component for profile avatar 3D depth effect  
- [x] `FloatingShape` component for parallax floating shapes
- [x] `ParallaxLayer` hooks for mouse-responsive parallax motion
- [x] **Homepage 3D Enhancements:**
  - Hero section with floating 3D shapes (parallax)
  - Lottie animation container with 3D tilt
  - Feature cards with 3D tilt + glare
  - "How it Works" step cards with 3D tilt
  - Trust stats cards with 3D tilt
  - Pricing cards with 3D tilt (Pro card more pronounced)
  - 3D buttons with depth shadows
- [x] **Public Profile 3D Enhancements:**
  - Avatar with DepthGlow + Tilt3DCard wrapper
  - All blocks (Retreat, Testimonial, etc.) wrapped with 3D tilt
  - Parallax container for immersive scrolling
- [x] All effects respect `prefers-reduced-motion` for accessibility
- [x] CSS utility classes: `.shadow-3d`, `.button-3d`, `.parallax-3d-container`, etc.

## Upcoming Tasks (Priority Order)
1. **Theme Engine Dashboard Controls** - Add UI to manage theme settings in dashboard

## Future/Backlog
- Stripe integration for Pro plan
- Cloudinary integration for image uploads
- Custom domains for Pro users
- Analytics dashboard
- Social media blocks (Instagram, YouTube, Twitter)
