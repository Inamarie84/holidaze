# Holidaze

A modern accommodation booking site built with **Next.js**, **TypeScript**, and **Tailwind CSS**.  
This project is part of my final exam assignment. It implements both customer and venue manager flows against the Noroff v2 API (Holidaze).

## ✨ Features

### For everyone

- Browse a paginated grid of venues
- Powerful search: destination, dates, guests
- Venue details page with image gallery, amenities, availability calendar (booked vs available days)
- Mobile-first, responsive layout

### Customers

- Register / Login / Logout (requires @stud.noroff.no email)
- Create bookings
- See upcoming and previous bookings in profile
- Update avatar / profile picture

### Venue Managers

- Register / Login / Logout (requires @stud.noroff.no email)
- Create, edit, and delete venues
- See upcoming bookings for their venues
- Update avatar / profile picture

## 🧭 User roles & terminology

- Visitor: not logged in
- Customer: logged-in user who books venues
- Venue Manager: logged-in user who manages venues (can CRUD venues)

## 🧱 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand (persisted session)
- **Icons & UI:** lucide-react, react-hot-toast
- **Linting/Format:** ESLint (flat config) + Prettier
- **Node:** ≥ 18
- **Hosting:** Vercel
- **Jest** / Testing Library (project includes tests scaffolding)

## 🚀 Getting Started

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Inamarie84/holidaze.git

   ```

2. Navigate to the project directory:

```bash
cd holidaze

```

3. Install dependencies:

```bash
npm install

```

4. Run the development server: (http://localhost:3000)

```bash
npm run dev

```

## Environment

Create a `.env.local` in the project root:

```bash
# Base Noroff v2 API (no trailing slash)
NEXT_PUBLIC_API_URL=https://v2.api.noroff.dev

```

## 🌐 API usage

All data comes from the Noroff v2 API (Holidaze).
Common calls:

- Venues (list): /holidaze/venues?page=&limit=&\_bookings=true
- Venue (by id): /holidaze/venues/:id?\_bookings=true&\_owner=true
- Profiles (self): /holidaze/profiles/:username
- Bookings (self): /holidaze/profiles/:username/bookings?\_venue=true
- Manager CRUD: /holidaze/venues (requires auth + venueManager)

The app uses a small helper wrapper to:

- Hydrate Authorization from session when needed
- Optionally include X-Noroff-API-Key
- Parse and normalize errors into friendly messages

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🔐 Auth & session

- Login/register calls save { token, user } to the Zustand store.
- The store is persisted in localStorage so you stay logged in across reloads.
- AuthGate and SessionHydrator ensure the UI doesn’t flicker before the session is rehydrated.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
