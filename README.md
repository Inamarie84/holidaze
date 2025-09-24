# Holidaze

A modern accommodation booking site built with **Next.js**, **TypeScript**, and **Tailwind CSS**.  
Implements both customer and venue manager flows against the Noroff v2 **Holidaze** API.

**Live:** https://holidaze-ten.vercel.app  
**Repo:** https://github.com/Inamarie84/holidaze

---

## ✨ Features

### For everyone

- Browse venues (paginated grid)
- Search by destination, dates, guests
- Venue details with gallery, amenities, and availability calendar
- Mobile-first, responsive UI

### Customers

- Register / Login / Logout (Noroff `@stud.noroff.no` email)
- Create bookings
- See upcoming & previous bookings in profile
- Update avatar

### Venue Managers

- Register / Login / Logout (Noroff `@stud.noroff.no` email)
- Create, edit, and delete venues
- See upcoming bookings for their venues
- Update avatar

### DX & Quality

- App Router (Next.js)
- Type-safe API helpers
- Persisted session with Zustand
- Toasts for feedback
- Accessible tooltips & skeleton UIs

---

## 🧱 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand (persisted)
- **UI / Icons:** lucide-react, react-hot-toast
- **Testing:** Jest + React Testing Library
- **Linting / Format:** ESLint + Prettier
- **Node:** ≥ 18
- **Deploy:** Vercel

---

## 🧭 Roles & Terminology

- **Visitor:** not logged in
- **Customer:** logged-in user who books venues
- **Venue Manager:** logged-in user who manages venues (CRUD venues)

---

## 🚀 Getting Started (Local)

1. **Clone**

```bash
git clone https://github.com/Inamarie84/holidaze.git
cd holidaze
```

3. Install dependencies:

```bash
npm install

```

4. Environment Variables – create .env.local:

```bash
# Base Noroff v2 API (no trailing slash)
NEXT_PUBLIC_API_URL=https://v2.api.noroff.dev


# Required for /holidaze/* endpoints (you can get your own key from https://api.noroff.dev)
NEXT_PUBLIC_API_KEY=YOUR_API_KEY_HERE

```

5. Run the development server: (http://localhost:3000)

```bash
npm run dev

```

6. Other scripts:

```bash
npm run build      # Create an optimized production build
npm run start      # Start the production server
npm run lint       # Run ESLint
npm run test       # Run tests with Jest
npm run prettier    # Run Prettier to format code

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

- Adds Authorization: Bearer <token> when available
- Adds X-Noroff-API-Key for Holidaze routes
- PNormalizes API errors into friendly messages

## 🔐 Auth & session

- Successful login/register stores { token, user } in a persisted Zustand store (localStorage).
- AuthGate guards protected pages; SessionHydrator prevents hydration flicker.
- After login, users are redirected back to their intended page.

## 🧑‍🎨 Screenshots

![Home](public/readme/home.png)
