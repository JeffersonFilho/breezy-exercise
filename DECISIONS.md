# Architectural Decisions

## 1. REST + TanStack Query over GraphQL + Apollo Client

**Choice**: Plain Express REST endpoints with `@tanstack/react-query` on the frontend.

**Why**:

- **Spec alignment**: The exercise defines REST endpoints (`GET /api/profile`, `PUT /api/profile/sections/:sectionId`, etc.). Using REST matches the spec directly with no translation layer.
- **Simplicity**: No schema definitions, no resolvers, no codegen. Each endpoint is a straightforward Express route handler.
- **TanStack Query provides the hard parts**: Automatic retries with exponential backoff, cache management, stale-while-revalidate, request deduplication, and mutation lifecycle hooks (`onMutate`, `onSuccess`, `onError`) — all without the overhead of a GraphQL client.
- **Smaller bundle**: TanStack Query is ~13KB gzipped vs Apollo Client's ~40KB.

**Trade-offs**:

- No normalized cache by entity ID (we manage the profile cache as a single object).
- No type-safe schema contract between client and server (mitigated by shared TypeScript types in `api-client.ts`).

## 2. Direct Cache Writes over Refetching

**Choice**: Mutations write server responses directly to the TanStack Query cache via `setQueryData` instead of calling `invalidateQueries` on success.

**Why**:

- **Zero unnecessary fetches**: After a successful save, the server response contains the updated section. Writing it directly to cache means no extra `GET /api/profile` request.
- **Instant UI**: The profile screen reflects changes immediately when navigating back from a modal — no loading spinner, no flicker.
- **Optimistic updates for perceived speed**: `onMutate` sets the expected state before the server responds. `onSuccess` overwrites with the real server data. `onError` rolls back to the previous snapshot.

**The flow**:

1. `onMutate`: Save previous cache → optimistically update status + completion
2. Server responds with 200: `onSuccess` writes the full section response to cache
3. Server responds with error: `onError` restores the previous cache snapshot
4. 409 conflict: `onError` rolls back → wrapper shows conflict toast → `invalidateQueries` fetches fresh data (one fetch, only when needed)

## 3. Polling (Option A) over WebSocket

**Choice**: `GET /api/profile/progress` polling via TanStack Query's `refetchInterval`. Polling is **off by default** because optimistic updates + `recalcCompletion()` already keep the progress bar current after every mutation. It can be enabled by flipping the `POLLING_ENABLED` constant in `use-profile.ts`.

**Why polling over WebSocket**:

- **Simpler infrastructure**: No WebSocket server, no persistent connection management, no reconnection logic. The polling endpoint is a plain GET route that already exists.
- **Fits TanStack Query naturally**: `refetchInterval` + `enabled` flag gives us start/stop polling in one line. No extra libraries (`socket.io-client`, `ws`) or manual event wiring.
- **Resilient to network issues**: Each poll is an independent HTTP request. Failed polls are silently retried on the next interval. A WebSocket drop requires explicit reconnection logic with exponential backoff.
- **Low overhead for this use case**: The `/api/profile/progress` endpoint returns ~50 bytes (percentage + timestamp). At 5-second intervals, this is negligible bandwidth.

**Why off by default**:

- In a single-user profile builder, progress only changes when **this** user saves a section. Optimistic cache updates via `recalcCompletion()` already reflect the change instantly — no network round-trip needed.
- Polling is useful when another session/device may update the profile concurrently. Flipping `POLLING_ENABLED = true` activates it.

**How it works**:

1. `useProgressPolling` wraps a `useQuery` with `refetchInterval: 5000` and `enabled` tied to the `POLLING_ENABLED` constant.
2. The `select` callback compares the polled percentage to the cached value and writes it into the `["profile"]` cache only if it differs — avoiding unnecessary re-renders.

**WebSocket trade-offs (Option B — not chosen)**:

- **Pro**: Instant push on change — no 5-second delay, zero wasted polls when nothing changes.
- **Con**: Requires a WebSocket server on a separate port (`ws://localhost:3001`), persistent connection lifecycle management, and reconnection logic on network drops.
- **Con**: Adds a dependency (`ws` on server, `socket.io-client` or raw `WebSocket` on client) for a single progress number.
- **Con**: Harder to test — requires a running WS server vs. a simple HTTP mock.

## 4. 409 Conflict Resolution Strategy

**Choice**: On conflict, show an informative toast, roll back the optimistic update, refresh the profile cache, and keep the modal open so the user can retry.

**Why**:

- **User stays in control**: The modal doesn't close on conflict — the user's form data is preserved. They can tap Save again to retry.
- **Clear communication**: A single toast explains what happened ("Conflict: data was updated elsewhere. Tap save to retry."). No duplicate or vague error messages.
- **Automatic data refresh**: `invalidateQueries` fetches the latest profile in the background, so the next save attempt won't conflict again (in real usage).

**How it works**:

1. Server returns 409 → TanStack Query's `onError` rolls back the optimistic update
2. The `updateSection` wrapper catches the `ApiError(409)`, shows a toast, and calls `invalidateQueries`
3. Returns `null` so the modal stays open (doesn't navigate back)
4. Modals check `if (!res) return` — no redundant error toast since the hook already handled it

## 5. Cancellable Photo Uploads (Multi-Layer)

**Choice**: Three-layer cancellation for photo uploads — client abort, server socket check, and unmount guard.

**Why**: A single `AbortController.abort()` only cancels the client-side fetch. The server may still process the upload and mutate state. All three layers are needed:

| Layer      | Mechanism                    | Purpose                                           |
| ---------- | ---------------------------- | ------------------------------------------------- |
| **Client** | `AbortController.abort()`    | Cancels the in-flight fetch request               |
| **Server** | `req.socket.destroyed` check | Skips state mutation if client disconnected       |
| **UI**     | `useIsMounted` ref           | Prevents toast/navigation after component unmount |

The Cancel button calls `abort()` + `mutation.reset()`. If the user navigates away, the `useEffect` cleanup aborts automatically.

## 6. Form Handling with react-hook-form

**Choice**: `react-hook-form` with `Controller` components for all section modals.

**Why**:

- **Uncontrolled inputs by default**: Better performance than useState-per-field, especially on React Native where re-renders are expensive.
- **Declarative validation**: `rules` prop handles required fields, pattern matching (email regex), and custom validators (phone digit count, bio length) without manual state management.
- **Per-field errors**: `formState.errors` provides typed error messages that render inline next to each field.

## 7. File-Based Routing with Expo Router

**Structure**:

```
app/
├── _layout.tsx            → Root: QueryClientProvider + NetworkProvider + Toast
├── index.tsx              → Splash screen (tap to continue)
└── profile/
    ├── _layout.tsx        → Stack navigator with themed header
    ├── index.tsx          → Profile builder (section list + progress bar)
    └── sections/[id].tsx  → Dynamic modal that renders the correct section form
```

Section modals are rendered inside `sections/[id].tsx` which maps the route param to the corresponding modal component (PhotoModal, ContactModal, etc.). This keeps the route structure flat while supporting 6 distinct forms.

## 8. Trade-offs Given Time Constraints

**What was built**:

- All 6 sections with forms, validation, and save functionality
- Optimistic updates with rollback on error
- 409 conflict handling with user-facing messaging
- Cancellable photo uploads (client + server + unmount)
- Animated gradient progress bar
- Dark mode, skeleton loading, pull-to-refresh, offline detection
- Progress polling (off by default, opt-in for multi-device sync)

**What would improve with more time**:

- Comprehensive test suite (Jest + React Native Testing Library)
- Offline mutation queue (persist failed mutations and replay on reconnect)
- Accessibility audit (screen reader labels, focus management)
- Shared form field abstraction to reduce duplication across modals
- E2E tests with Detox
