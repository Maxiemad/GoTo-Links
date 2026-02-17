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

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: Supabase PostgreSQL via Prisma ORM
- **Authentication**: JWT + Google OAuth (Emergent Auth)
- **Payments**: Stripe (test mode)
- **File Uploads**: Cloudinary
- **Deployment**: Vercel-ready structure

### Project Structure
```
/app
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Auth endpoints
│   │   ├── profile/       # Profile endpoints
│   │   ├── blocks/        # Block CRUD endpoints
│   │   ├── analytics/     # Analytics endpoints
│   │   ├── payments/      # Stripe checkout endpoints
│   │   └── upload/        # Cloudinary signature endpoint
│   ├── (auth)/            # Auth pages (login, signup, callback)
│   ├── dashboard/         # Protected dashboard pages
│   └── profile/[handle]/  # Public profile pages
├── lib/                   # Utility libraries
│   ├── prisma.ts          # Database client
│   ├── auth.ts            # Authentication helpers
│   ├── stripe.ts          # Stripe integration
│   └── cloudinary.ts      # Cloudinary integration
├── prisma/
│   └── schema.prisma      # Database schema
└── types/                 # TypeScript types
```

### Database Schema (Prisma)
- **User**: Core user model with email/Google auth, plan status
- **Session**: JWT session management
- **Profile**: User profile with themes, bio, location
- **Block**: Flexible content blocks (links, retreats, testimonials, etc.)
- **Analytics**: Event tracking for profile views and clicks
- **Payment**: Stripe payment records

## User Personas
1. **Wellness Creator**: Yoga instructors, meditation teachers, healers
2. **Retreat Organizer**: Hosts who run wellness retreats
3. **Coaches/Consultants**: Life coaches, wellness consultants
4. **Venue Owners**: Wellness spaces, retreat centers

## Core Requirements (Static)
- [ ] User registration/login (email + Google OAuth)
- [ ] Profile creation and customization
- [ ] Multiple block types (links, retreats, testimonials, etc.)
- [ ] Theme selection (6 themes available)
- [ ] Public profile page with unique handle
- [ ] Analytics tracking (views, clicks)
- [ ] Pro plan upgrade via Stripe ($19/month)
- [ ] Cloudinary image/video uploads
- [ ] Mobile-responsive design

## What's Been Implemented (Jan 2026)

### Phase 1: Migration Complete ✅
- [x] Next.js 14 App Router setup
- [x] Tailwind CSS configuration
- [x] Prisma schema for PostgreSQL
- [x] Homepage with hero, features, pricing sections
- [x] Login page with Google OAuth button
- [x] Signup page with form validation
- [x] OAuth callback handler (Emergent Auth)
- [x] Dashboard page with stats and actions
- [x] Profile editor with blocks management
- [x] Public profile page with theming
- [x] Upgrade page (Stripe checkout)
- [x] All API routes scaffolded

### API Routes Implemented
- `POST /api/auth/signup` - Email registration
- `POST /api/auth/login` - Email login
- `POST /api/auth/logout` - Session logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/google` - Google OAuth callback
- `GET /api/profile` - Get user's profile
- `PUT /api/profile` - Update profile
- `GET /api/profile/[handle]` - Get public profile
- `GET /api/blocks` - List blocks
- `POST /api/blocks` - Create block
- `PUT /api/blocks/[id]` - Update block
- `DELETE /api/blocks/[id]` - Delete block
- `POST /api/blocks/reorder` - Reorder blocks
- `GET /api/analytics` - Get analytics
- `POST /api/analytics/track` - Track events
- `POST /api/payments/checkout` - Create Stripe checkout
- `GET /api/payments/status/[sessionId]` - Check payment status
- `GET /api/upload/signature` - Get Cloudinary signature

## Prioritized Backlog

### P0 (Critical - Before Production)
- [ ] Configure Supabase database credentials
- [ ] Run Prisma migrations on Supabase
- [ ] Configure Cloudinary credentials
- [ ] Verify Stripe integration with real test keys
- [ ] Test complete auth flow end-to-end

### P1 (Important)
- [ ] Image upload for profile photos
- [ ] Video upload for Pro users (hero background)
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] Block drag-and-drop reordering

### P2 (Nice to Have)
- [ ] Custom domain support
- [ ] Advanced analytics dashboard
- [ ] Social media link icons
- [ ] SEO meta tags for public profiles
- [ ] Share functionality

## Next Tasks
1. Add actual Supabase credentials to `.env.local`
2. Run `npx prisma db push` to create tables
3. Test signup/login flow
4. Add Cloudinary credentials
5. Test image upload
6. Deploy to Vercel

## Environment Variables Required
See `.env.example` for full list:
- `DATABASE_URL` - Supabase Transaction Pooler URI
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `JWT_SECRET` - JWT signing secret
- `STRIPE_SECRET_KEY` - Stripe secret key
