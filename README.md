<div align="center">

<br/>

```
██████╗  █████╗ ██████╗ ██╗  ██╗███████╗██╗  ██╗ █████╗ ██████╗ ███████╗
██╔══██╗██╔══██╗██╔══██╗██║ ██╔╝██╔════╝██║  ██║██╔══██╗██╔══██╗██╔════╝
██████╔╝███████║██████╔╝█████╔╝ ███████╗███████║███████║██████╔╝█████╗  
██╔═══╝ ██╔══██║██╔══██╗██╔═██╗ ╚════██║██╔══██║██╔══██║██╔══██╗██╔══╝  
██║     ██║  ██║██║  ██║██║  ██╗███████║██║  ██║██║  ██║██║  ██║███████╗
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
```

### **Park in someone's driveway. By the hour. For less.**

A peer-to-peer residential parking marketplace for Dhaka, Bangladesh.

<br/>

[![Live](https://img.shields.io/badge/LIVE-%E2%97%8F%20parkshare.sowadh.me-C8FF3D?style=for-the-badge&labelColor=0E0E0C&color=C8FF3D)](https://parkshare.sowadh.me)
&nbsp;
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=61DAFB&labelColor=0E0E0C)](https://react.dev)
&nbsp;
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=339933&labelColor=0E0E0C)](https://nodejs.org)
&nbsp;
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=3ECF8E&labelColor=0E0E0C)](https://supabase.com)
&nbsp;
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=635BFF&labelColor=0E0E0C)](https://stripe.com)

<br/>

</div>

---

## Overview

ParkShare connects **drivers** who need hourly parking with **homeowners** who have unused driveways. Built for Dhaka — Gulshan, Banani, Dhanmondi — it handles the full lifecycle from discovery to payment to review, with an admin layer for KYC verification and platform moderation.

```
Driver                    Host                      Admin
──────                    ────                      ─────
Search spots on map  →    List driveway         →   Review KYC requests
Book by the hour     →    Approve / reject      →   Moderate users & spots
Pay with Stripe      →    Track earnings        →   Platform analytics
Leave a review       →    Manage availability   →   Review moderation
```

---

## Portals

<table>
<tr>
<td width="33%" valign="top">

### 🚗 Driver
- Map-based spot search with price, size & availability filters
- Hourly booking with 15-min precision
- Stripe checkout + instant confirmation
- Booking history, cancellations & refunds
- Post-stay reviews

</td>
<td width="33%" valign="top">

### 🏠 Host
- List a driveway in under 5 minutes
- Approve or reject booking requests
- Earnings dashboard + transaction history
- Pause, edit or remove spots anytime
- Spot image uploads

</td>
<td width="33%" valign="top">

### ⚙️ Admin
- KYC request queue — approve or reject with conflict detection
- User & spot moderation
- Review management
- Platform-wide stats (users, revenue, bookings)

</td>
</tr>
</table>

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 18 + Vite | Fast HMR, component portals |
| Styling | Tailwind CSS | Utility-first, consistent design tokens |
| Routing | React Router v6 | Nested layouts per role |
| Backend | Node.js + Express | Lightweight, all routes in one file |
| Database | Supabase (PostgreSQL) | Realtime-ready, RLS, instant REST API |
| Auth | JWT + Passport.js | Stateless; Google OAuth 2.0 support |
| Payments | Stripe | Payment intents + webhook-ready refunds |
| Uploads | Multer (local disk) | Avatar + spot image handling |
| Container | Docker + Compose | One-command local stack |

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Supabase](https://supabase.com) project (free tier works)
- [Stripe](https://stripe.com) account (test mode)
- Google OAuth credentials — [console.cloud.google.com](https://console.cloud.google.com)

### Install & run

```bash
# 1. Clone
git clone https://github.com/your-username/ParkShare-App.git
cd ParkShare-App

# 2. Install dependencies
cd server && npm install && cd ../client && npm install && cd ..

# 3. Add environment files (see below)

# 4. Seed the database
cd server && node seed.js

# 5. Start dev servers (two terminals)
cd server && npm run dev      # → localhost:5000
cd client && npm run dev      # → localhost:5173
```

### Environment variables

**`server/.env`**
```env
PORT=5000
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=a_long_random_string
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
STRIPE_SECRET_KEY=sk_test_xxxx
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

### Docker (optional)

```bash
docker-compose up --build
```

---

## KYC Flow

Every new account (email or Google) enters a **pending** state and cannot access the platform until an admin reviews their submission.

```
Register / Google signup
        │
        ▼
   Submit NID + license plate (drivers)
        │
        ▼
   ┌─────────────────────────────┐
   │  kyc_status = 'pending'     │  ← user sees "Application submitted" screen
   └─────────────────────────────┘
        │
        ▼
   Admin reviews at /admin/kyc-requests
        │
        ├── NID or plate already linked to another account? → 🔴 conflict badge shown
        │
        ├── APPROVE → kyc_status = 'approved' → notification sent → user can log in
        │
        └── REJECT  → kyc_status = 'rejected' → reason sent as notification
                            │
                            └── User can correct details and resubmit
```

> A partial unique index (`WHERE kyc_status = 'approved'`) means multiple people can submit the same NID for review, but only one can ever be approved — the database enforces it.

---

## Demo Accounts

> Run `node seed.js` first. Demo accounts are pre-approved and skip the KYC queue.

| Role | Email | Password |
|---|---|---|
| 🚗 Driver | `driver@demo.com` | `password123` |
| 🏠 Host | `host@demo.com` | `password123` |
| ⚙️ Admin | `admin@demo.com` | `password123` |

---

## Project Structure

```
ParkShare-App/
│
├── client/                        # Vite + React
│   └── src/
│       ├── portals/
│       │   ├── Public/            # Home, Login, Register, KYC pages
│       │   ├── Driver/            # Dashboard, search, bookings, payments
│       │   ├── Host/              # Dashboard, spots, earnings
│       │   └── Admin/             # Moderation, KYC requests, stats
│       ├── components/UI/         # Shared components (Button, Modal, Badge…)
│       └── context/AuthContext    # JWT auth + axios defaults
│
├── server/
│   ├── config/
│   │   ├── passport.js            # Google OAuth strategy
│   │   └── supabase.js            # Supabase client
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── roleMiddleware.js      # Role-based access control
│   ├── models/                    # Query helpers (User, Spot, Booking…)
│   ├── seed.js                    # Demo data seeder
│   └── index.js                   # All API routes (~900 lines)
│
└── docker-compose.yml
```

---

## API Overview

```
POST  /api/auth/register              Sign up with email
POST  /api/auth/login                 Sign in
POST  /api/auth/complete-kyc          Submit KYC (Google OAuth users)
GET   /api/auth/google                Initiate Google OAuth

GET   /api/spots                      Search spots (public)
POST  /api/spots                      Create spot (host)
GET   /api/spots/:id/booked-slots     Availability check

POST  /api/bookings                   Create booking (driver)
POST  /api/bookings/:id/approve       Approve booking (host)
POST  /api/bookings/:id/reject        Reject booking (host)

POST  /api/payments/create-intent     Create Stripe PaymentIntent
POST  /api/payments/confirm           Confirm payment + notify parties

GET   /api/admin/kyc-requests         List pending KYC submissions
POST  /api/admin/kyc-requests/:id/approve
POST  /api/admin/kyc-requests/:id/reject
GET   /api/admin/stats                Platform analytics
```

---

## Design Language

| Token | Value | Usage |
|---|---|---|
| `ink` | `#0E0E0C` | Primary text, dark backgrounds |
| `paper` | `#F6F4EE` | Page backgrounds, cards |
| `lime` | `#C8FF3D` | CTAs, highlights, active states |
| `muted` | `#8A8275` | Secondary text, labels |
| Font (body) | DM Sans | All UI text |
| Font (mono) | JetBrains Mono | Prices, codes, stat labels |

---

<div align="center">

Built for **CSE482L — Software Development Project**  
North South University · Group 05 · Spring 2026

<br/>

[![MIT License](https://img.shields.io/badge/license-MIT-C8FF3D?style=flat-square&labelColor=0E0E0C)](LICENSE)
&nbsp;
[![NSU](https://img.shields.io/badge/NSU-CSE482-C8FF3D?style=flat-square&labelColor=0E0E0C)](https://northsouth.edu)

</div>
