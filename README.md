# Breezy - Real Estate Agent Profile Builder

A React Native (Expo) mobile app for real estate agents to build their professional profile. Agents complete 6 profile sections (photo, contact, socials, brokerage, branding, bio) with an animated progress bar.

## Architecture

- **Frontend**: React Native + Expo Router + TanStack Query + react-hook-form
- **Backend**: Express REST API with intentional failure simulation
- **State**: In-memory (mock API with random delays, 500s, and 409 conflicts)

## Quick Start

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:3000` with nodemon (auto-restarts on file changes).

### 2. Start the Frontend

```bash
cd frontend
npm install
npx expo start
```

Press `i` for iOS Simulator or `a` for Android Emulator.

## REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/profile` | Fetch full profile with all sections |
| `PUT` | `/api/profile/sections/:sectionId` | Update a section's status and data |
| `PUT` | `/api/profile/photo` | Upload a profile photo |
| `GET` | `/api/profile/progress` | Get completion percentage |

## Mock Failure Modes

The backend intentionally injects failures to test error handling:

| Operation | Delay | Failure Rate |
|-----------|-------|--------------|
| GET profile | 1-2s | 10% server error |
| Update section | 0.5-1s | 15% conflict (409), 10% server error (500) |
| Upload photo | 3-5s | 20% server error |

## Features

- **6 profile sections**: Photo upload, contact details, social links, brokerage info, team branding, and bio
- **Optimistic updates**: UI updates instantly on save, rolls back on error
- **Direct cache writes**: Mutations write server responses directly to TanStack Query cache (zero unnecessary refetches)
- **409 conflict handling**: Informative toast message, cache rollback, auto-refresh of stale data
- **Cancellable uploads**: Photo uploads can be cancelled mid-flight (client abort + server-side socket check)
- **Unmount safety**: `useIsMounted` guard prevents toast/navigation after component unmount
- **Form validation**: react-hook-form with per-field validation rules
- **Animated progress bar**: Gradient fill via expo-linear-gradient with smooth reanimated transitions
- **Dark mode**: Full theme support following system preferences
- **Skeleton loading**: Shimmer placeholders while data loads
- **Offline detection**: Banner shown when disconnected, auto-refetch on reconnect
- **Pull-to-refresh**: Swipe down to refresh profile data

## Project Structure

```
breezy-test/
├── backend/src/
│   ├── index.ts                  # Express REST server + request logging
│   ├── state.ts                  # In-memory profile state
│   ├── types.ts                  # Shared TypeScript types
│   └── middleware/failure.ts     # Random delay, 500, and 409 injection
├── frontend/
│   ├── app/                      # Expo Router file-based routes
│   │   ├── _layout.tsx           # Root: QueryClientProvider + NetworkProvider
│   │   ├── index.tsx             # Splash screen
│   │   └── profile/
│   │       ├── _layout.tsx       # Stack navigator
│   │       ├── index.tsx         # Main profile builder screen
│   │       └── sections/[id].tsx # Dynamic modal per section
│   ├── components/
│   │   ├── modals/               # 6 section modals (bio, branding, etc.)
│   │   ├── progress-bar/         # Animated gradient progress bar
│   │   ├── section-card/         # Profile section list item
│   │   ├── skeleton-loader/      # Loading placeholders
│   │   ├── offline-banner/       # Network status banner
│   │   ├── error-boundary/       # React error boundary
│   │   └── ui/                   # Primitives (Box, Text, Input, Button)
│   ├── hooks/
│   │   ├── use-profile.ts        # TanStack Query hooks (useProfile, useUpdateSection, useUploadPhoto)
│   │   ├── use-is-mounted.ts     # Unmount safety guard
│   │   ├── use-theme.ts          # Theme colors hook
│   │   └── use-network.ts        # Network connectivity hook
│   ├── lib/
│   │   ├── api-client.ts         # Typed fetch functions + ApiError class
│   │   └── query-client.ts       # TanStack QueryClient config (retry, staleTime)
│   ├── providers/
│   │   └── network-provider.tsx  # NetInfo context + auto-invalidation on reconnect
│   └── constants/
│       └── theme.ts              # Light/dark theme tokens
├── DECISIONS.md                  # Architectural decisions
└── README.md
```

See [DECISIONS.md](./DECISIONS.md) for architectural rationale.
