# CineBook

CineBook is a portfolio movie reservation system. Customers discover movies and upcoming screenings, select seats from a theater's saved layout, and create or cancel database-backed reservations. Administrators manage the same movies, theaters, showtimes, and reservations through a protected CMS.

The project demonstrates a connected customer and admin workflow. It is not a payment processor or a claim of production readiness.

## Stack

- Next.js 16 App Router and React 19
- TypeScript, Tailwind CSS, and Framer Motion
- MongoDB with Mongoose
- NextAuth credentials authentication and JWT sessions
- TanStack Query for client-side data fetching and cache updates
- Zod for API input validation
- Cloudinary for optional, admin-only poster uploads
- TMDB for admin-only movie metadata import

## Architecture

- `app/` contains customer and admin pages plus App Router API routes.
- `component/` contains customer, booking, CMS, and shared UI components.
- `models/` defines the MongoDB user, movie, theater, showtime, and booking models.
- `services/` reads discovery data and applies reservation operations.
- `lib/` contains database access, authentication guards, input and booking rules, and response projections.
- `types/` contains shared application data types.
- `proxy.ts` redirects protected page requests. Admin APIs also check the session and role on the server; the proxy is not the API security boundary.

## Customer reservation flow

1. Home and catalog pages load active movies from MongoDB.
2. Movie pages list future showtimes backed by Movie and Theater records.
3. Seat selection reads the showtime's real theater layout and booked seat labels.
4. Reservation review is shown before confirmation. Signing in is required to reserve.
5. The booking service re-reads the movie, showtime, theater, seat layout, and price on the server. It validates the seat labels, prevents occupied-seat conflicts, calculates the total, and saves the booking with the seat update in a MongoDB transaction.
6. Confirmation loads the saved booking by its database ID. Booking history is scoped to the signed-in user.
7. A future confirmed reservation can be cancelled. The transaction changes its status and releases its seats together.

MongoDB transactions require a replica set. MongoDB Atlas supports this; a local MongoDB server must be configured as a replica set.

## Admin CMS

The admin area includes Overview, Movies, Theaters, Showtimes, Reservations, and Users. Dashboard counts come from MongoDB. User management is read-only. API mutations require an admin session; page access is also protected.

Movie, theater, and showtime deletion checks preserve records referenced by showtimes or reservations. Theater layouts cannot be changed after showtimes use them. Showtime schedules with reservations are protected. The optional seed endpoint is admin-only and only runs when bookings and catalog collections are empty.

Administrators can search TMDB and review movie metadata before importing it into the CineBook movie collection. TMDB credentials are used only in server routes. TMDB IDs are optional external references; showtimes and bookings continue using CineBook MongoDB IDs. Manual movie creation remains available.

To provision the first administrator, an operator must assign the `admin` role to a trusted account in MongoDB. CineBook does not provide a public role-promotion flow.

## Setup

Use Node.js 22 and npm.

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Copy `.env.example` to `.env.local` and set the required values.
3. Point `DATABASE_URL` at a MongoDB replica-set database.
4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`.

An empty database can be populated through the protected `POST /api/seed` endpoint after an administrator account has been provisioned. Administrators can also create movies, theaters, and showtimes through the CMS.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | MongoDB replica-set connection string |
| `NEXTAUTH_SECRET` | Yes | Signs and encrypts NextAuth sessions |
| `NEXTAUTH_URL` | Production | Public application origin used by NextAuth |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Optional | Cloudinary account name for poster uploads |
| `CLOUDINARY_API_KEY` | Optional | Cloudinary server API key |
| `CLOUDINARY_API_SECRET` | Optional | Cloudinary server API secret |
| `TMDB_API_TOKEN` | Optional | TMDB API Read Access Token, used only by server-side admin search/details routes |

Do not commit `.env.local` or production credentials. Without Cloudinary configuration, poster uploads return a clear unavailable response; an administrator can use a valid poster URL instead.

### TMDB import setup and troubleshooting

1. In your [TMDB account API settings](https://www.themoviedb.org/settings/api), copy the **API Read Access Token** (not the API key).
2. Set `TMDB_API_TOKEN` in `.env.local`, or in the deployed server's environment. `.env.example` is documentation and is not loaded by Next.js. Keep the token server-only; never use a `NEXT_PUBLIC_` variable.
3. Restart Next.js after configuring it. Sign in as a CineBook administrator, open Movies → Import from TMDB, search, review/edit the metadata, then import.

Missing configuration returns HTTP 503 with setup instructions. Rejected TMDB credentials also return 503 with a different message; upstream/network failures return 502 and timeouts return 504. CineBook login/access failures return 401/403. Database lookup failures explicitly identify CineBook's import check. These errors are shown in the import interface; no separate TMDB connection or user login is needed.

Imports create ordinary MongoDB movies. Existing imports are marked in search results, and duplicate imports are rejected with HTTP 409. Schedule a CineBook showtime separately to make a movie bookable. Backdrops can be edited or cleared in the Movie CMS; clearing one restores the poster fallback on movie details.

## Checks

```bash
npx tsc --noEmit
npm run lint
npm test
npm run test:integration
npm run build
```

The unit tests cover booking rules, access decisions, CMS relationship rules, upload signatures, seed protection, safe user responses, and TMDB mapping, service errors, protected routes, import conflicts, and backdrop edits. TMDB requests are mocked; tests never require a live TMDB token or internet access to TMDB.

The integration tests connect to MongoDB using `DATABASE_URL` and each create and drop their own uniquely named temporary database. They exercise booking conflicts, authorization, cancellation, seat release, and mocked TMDB metadata imported into real MongoDB movies, including duplicate index enforcement, customer discovery, and reservations. Use a test MongoDB account that can create and drop databases. This verifies mocked imports; it does not replace live TMDB verification with a valid local token.

## Demo limitations

- Reservations do not collect payment.
- There are no email or password-reset messages.
- Seat availability updates when data is fetched; there are no live Socket.IO updates.
- TMDB imports are manual, require a server-side token, and do not synchronize after import.
- Dashboard metrics are operational counts, not revenue or growth analytics.
- Public support contact details are not configured.

Google OAuth is not offered: the current account model and booking authorization use CineBook credentials and MongoDB user IDs.

TMDB metadata and images are attributed in the About section. Commercial use of TMDB data may require a separate agreement; CineBook does not claim TMDB endorsement.
