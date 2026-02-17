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
- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS - **ORIGINAL UI PRESERVED**
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
│   ├── api/               # API Routes (Backend)
│   │   ├── auth/          # Auth endpoints
│   │   ├── profile/       # Profile endpoints
│   │   ├── blocks/        # Block CRUD endpoints
│   │   ├── analytics/     # Analytics endpoints
│   │   ├── payments/      # Stripe checkout endpoints
│   │   └── upload/        # Cloudinary signature endpoint
│   ├── components/        # Original React components (preserved)
│   ├── styles/            # Original styles and themes (preserved)
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

## What's Been Implemented (Jan 2026)

### Phase 1: Migration Complete ✅
- [x] Next.js 14 App Router setup
- [x] **ORIGINAL UI PRESERVED** - All components, animations, spacing, and styling intact
- [x] Prisma schema for PostgreSQL
- [x] All API routes scaffolded

### API Routes Implemented (Backend Only)
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

## Next Tasks
1. Add actual Supabase credentials to `.env.local`
2. Run `npx prisma db push` to create tables
3. Test signup/login flow
4. Add Cloudinary credentials
5. Deploy to Vercel

## Environment Variables Required
See `.env.example` for full list
