# Movie Reservation System

A **full-stack movie reservation system** built with Next.js, TypeScript, TailwindCSS, and MongoDB.  
Users can browse movies, view details, select showtimes, pick seats, and confirm bookings. Admins can manage movies, theaters, showtimes, and view booking analytics.

---

## Table of Contents

- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Demo

_Add your live demo link or screenshots here._

---

## Tech Stack

- **Frontend & Backend:** Next.js (App Router) + TypeScript
- **Styling:** TailwindCSS
- **Animations & UI Effects:** Framer Motion
- **Icons:** Lucide Icons
- **Data Fetching:** React Query
- **Database:** MongoDB
- **Authentication:** NextAuth.js

---

## Features

### User-Facing

- Browse movies with grid cards and filters (genre, date, popularity)
- View detailed movie information
- Select showtimes
- Interactive seat selection with availability indicators
- Confirm bookings with optional payment
- View past and upcoming bookings in user profile
- Fully responsive design (mobile, tablet, desktop)
- Loading states (skeletons/spinners) for all async data
- Accessible and performance-optimized

### Admin Dashboard (Optional)

- Add, update, delete movies
- Manage theaters and seat layouts
- Manage showtimes
- View booking analytics with charts
- Fully responsive, modern dashboard

### Additional Pages

- About
- Contact
- Footer included globally

---

## Folder Structure

my-movie-app/
│
├─ app/
│ ├─ page.tsx # Home page
│ ├─ movies/[id]/page.tsx # Movie details
│ ├─ seats/[showtimeId]/page.tsx
│ ├─ profile/page.tsx
│ ├─ admin/...
│ ├─ about/page.tsx
│ ├─ contact/page.tsx
│ └─ api/
│ ├─ auth/...
│ ├─ movies/...
│ ├─ showtimes/...
│ └─ bookings/...
│
├─ components/ # Reusable UI components
├─ lib/ # Database & helper functions
├─ styles/ # Tailwind config / global CSS
├─ public/ # Static assets (images, posters)
├─ types/ # TypeScript types
├─ package.json
├─ tsconfig.json
└─ next.config.js
