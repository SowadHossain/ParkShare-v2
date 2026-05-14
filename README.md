# ParkShare

**Book a driveway. By the hour. For less.**

ParkShare is a peer-to-peer residential driveway marketplace for Dhaka, Bangladesh. Drivers find and book unused driveways near their destination; hosts earn passive income from space they aren't using.

🌐 **Live:** [parkshare.sowadh.me](https://parkshare.sowadh.me)

---

## Features

### For Drivers
- Search parking spots on an interactive map with price, size, and availability filters
- Book by the hour with 15-minute precision
- Stripe-powered checkout with instant confirmation
- Booking history, cancellations, and refunds
- Leave reviews after completed bookings

### For Hosts
- List a driveway in minutes — set price, availability window, and vehicle size
- Approve or reject incoming booking requests
- Earnings dashboard with transaction history
- Spot management (edit, pause, delete)

### For Admins
- User and spot moderation
- KYC request review — approve or reject with conflict detection (flags if an NID or license plate is already linked to another approved account)
- Review moderation
- Platform-wide stats (users, bookings, revenue)

### Platform
- Email/password and Google OAuth sign-in
- Admin-reviewed KYC — every new account submits NID and (for drivers) license plate before accessing the platform
- In-app notifications
- Fully responsive — mobile-first design

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express |
| Database | Supabase (PostgreSQL) |
| Auth | JWT, Passport.js (Google OAuth 2.0) |
| Payments | Stripe |
| File storage | Local (multer) |
| Containerisation | Docker, Docker Compose |

---

## Project Structure

```
ParkShare-App/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── portals/
│       │   ├── Public/      # Home, Login, Register, KYC pages
│       │   ├── Driver/      # Driver dashboard, search, bookings
│       │   ├── Host/        # Host dashboard, spots, earnings
│       │   └── Admin/       # Admin moderation, KYC requests
│       ├── components/      # Shared UI components
│       └── context/         # Auth context
├── server/                  # Express API
│   ├── config/              # Supabase client, Passport strategy
│   ├── middleware/          # Auth, role guards
│   ├── models/              # DB query helpers
│   └── index.js             # All routes
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account
- Google OAuth credentials ([console.cloud.google.com](https://console.cloud.google.com))

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/ParkShare-App.git
cd ParkShare-App

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Environment Variables

**`server/.env`**
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=a_long_random_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

### Run (development)

```bash
# Terminal 1 — API
cd server && npm run dev

# Terminal 2 — Client
cd client && npm run dev
```

### Run with Docker

```bash
docker-compose up --build
```

### Seed demo data

```bash
cd server && node seed.js
```

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Driver | driver@demo.com | password123 |
| Host | host@demo.com | password123 |
| Admin | admin@demo.com | password123 |

> Demo accounts bypass KYC and are pre-approved.

---

## KYC Flow

New users (email or Google signup) submit their National ID and (drivers) license plate. The account is locked in **pending** state until an admin reviews the request at `/admin/kyc-requests`. The admin can see if an NID or plate conflicts with an existing approved account, then approve or reject with an optional reason. Rejected users receive a notification and can resubmit corrected details.

---

## Course Info

Built for **CSE482L — Software Development Project**, North South University  
**Group 05** · Spring 2026

---

## License

MIT
