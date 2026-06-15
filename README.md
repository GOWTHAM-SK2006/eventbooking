# EventBook - Premium Event Booking Platform

A modern, production-ready event booking and management platform built with Next.js 15, TypeScript, and Supabase.

## Features

### User Features
- Browse and search events
- Filter events by category
- View detailed event information
- Book tickets with live seat availability
- QR code ticket generation
- Download ticket PDFs
- Booking history
- User profile management
- Wishlist/favorite events
- Notification center

### Admin Features
- Beautiful analytics dashboard
- Event management (create, edit, delete)
- Booking management
- User management
- Payment verification
- Attendance tracking
- Export reports

### Advanced Features
- Real-time slot updates
- Waitlist system
- Event reminders
- Certificate generation
- Reviews and ratings
- Team registrations

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Database**: Supabase PostgreSQL
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Animations**: Framer Motion
- **QR Code**: qrcode.react

## Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account
- Stripe account (for payments)

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd event-booking
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase and Stripe credentials.

4. Set up Supabase database
- Create a new Supabase project
- Run the SQL schema from `supabase/migrations/schema.sql` in your Supabase SQL editor

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── admin/           # Admin dashboard
│   ├── events/          # Event pages
│   ├── bookings/        # Booking pages
│   ├── profile/         # User profile
│   └── layout.tsx       # Root layout
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── layout/          # Layout components
│   ├── cards/           # Card components
│   └── providers.tsx    # App providers
├── lib/
│   ├── supabase/        # Supabase clients
│   ├── hooks/           # React hooks
│   └── utils.ts         # Utility functions
├── store/               # Zustand store
└── types/               # TypeScript types
```

## Design System

The application uses a premium design system with:
- Deep Indigo (#4F46E5) primary color
- Electric Blue (#3B82F6) secondary color
- Cyan (#06B6D4) accent color
- Glassmorphism effects with backdrop blur
- Smooth animations with Framer Motion
- Fully responsive design
- Dark and light mode support

## License

MIT