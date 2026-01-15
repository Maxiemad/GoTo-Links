# GoToLinks - Wellness Link in Bio SaaS

A beautiful, mobile-first SaaS web app for wellness facilitators, retreat organizers, and venue owners to create branded link-in-bio profiles.

## Features

- **Public Marketing Homepage** - Beautiful landing page with hero, features, pricing, and demo
- **Authentication** - Sign up and login with email/password (Google OAuth ready)
- **Creator Dashboard** - View stats, profile views, link clicks, and top performing links
- **Profile Editor** - Full-featured editor with:
  - Profile settings (name, headline, bio, photo, location)
  - Blocks manager (links, retreats, testimonials, booking calls, WhatsApp/Telegram)
  - Drag-and-drop reordering
  - Live preview
  - Theme selector (4 beautiful wellness themes)
- **Public Profile Pages** - Stunning mobile-first profiles with:
  - Video hero section
  - Profile information
  - Customizable blocks
  - Theme-based styling

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- React Router for routing
- Custom design system with wellness color palette

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── styles/          # Theme and global styles
├── types/           # TypeScript type definitions
├── utils/           # Mock data and utilities
├── App.tsx          # Main app component with routing
└── main.tsx         # Entry point
```

## Routes

- `/` - Marketing homepage
- `/login` - Login page
- `/signup` - Sign up page
- `/dashboard` - Creator dashboard
- `/dashboard/profile-editor` - Profile editor
- `/profile/:handle` - Public profile page

## Design System

The app uses a wellness-focused color palette:
- **Teal** - Primary brand color
- **Sage** - Secondary green tones
- **Gold** - Accent color
- **White & Grays** - Neutral backgrounds

## Themes

Four pre-built themes available:
1. Sacred Earth - Earthy browns and beige
2. Zen Minimal - White, light gray, subtle teal
3. Mystic Teal & Gold - Deep teal with gold accents
4. Ocean Temple - Blue/teal gradient

## Next Steps

- Connect to real backend API
- Add video upload functionality
- Implement drag-and-drop for blocks
- Add Google OAuth
- Payment integration for Pro plans
- Custom domain support

