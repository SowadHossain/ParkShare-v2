# ParkShare — Product Requirements Document (PRD)

> **Use this PRD as the build specification for Claude Code.** Follow the rules and coding patterns *exactly* — they are intentionally beginner-friendly for a university lab project.

---

## 1. Project Overview

**Name:** ParkShare — The Residential Driveway Marketplace (Airbnb for Parking)

**Goal:** A web-based marketplace connecting drivers needing short-term parking with homeowners who have unused driveway space. Drivers search a map, book a time slot, pay via Stripe (test mode), and leave reviews. Hosts list driveways, manage availability, and view earnings.

**Course:** CSE482 Lab Project — Group 05 (Tawsif Ahmed, Sowad Hossain), NSU

**UX Principle:** Each screen does one job well. Prefer many small focused pages over a few crowded ones. Every action gets an explicit confirmation screen — never rely on `alert()` alone for important flows.

---

## 2. Tech Stack

### Frontend
- **React 18 with Vite**
- **React Router (createBrowserRouter + RouterProvider)**
- **Axios** for all HTTP calls
- **Tailwind CSS** for styling
- **@react-google-maps/api** for Google Maps integration
- **@stripe/react-stripe-js + @stripe/stripe-js** for Stripe Elements
- Hooks only: `useState`, `useEffect`, `useNavigate`, `useParams`
- React Context **only** for `AuthContext` (current user + token). No Redux/Zustand.
- Functional components only. No TypeScript. No Next.js.

### Backend
- **Node.js + Express.js**
- **PostgreSQL** (Neon or Supabase for cloud hosting)
- **`pg`** (node-postgres) — raw SQL queries, **no ORM**
- **dotenv**, **cors**, **bcrypt**, **jsonwebtoken**, **passport**, **passport-google-oauth20**
- **stripe** (server SDK)

### Deployment
- Frontend: Vercel or Netlify
- Backend: Render or Fly.io
- Database: Neon or Supabase (PostgreSQL)

---

## 3. User Personas

### Driver (Rafiq, 28, ride-share driver in Dhaka)
Needs quick parking near work or appointments. Mobile-first. Cares about price, distance, and trust signals (host rating).

### Host (Mrs. Khan, 45, homeowner in Gulshan)
Has an empty driveway 9 AM – 5 PM while at work. Wants passive income with minimal effort. Cares about reliable drivers and easy money tracking.

### Admin (NSU instructor / platform owner)
Moderates listings, removes bad actors, monitors platform health.

---

## 4. End-to-End User Flows

### Flow A — First-time Driver onboarding & first booking

```
Landing (/)
   ↓ "Sign up"
Register (/register)
   ↓ Role = Driver, fill form
Welcome Driver (/driver/welcome)            ← one-time onboarding
   ↓ "Get started"
Search Spots (/driver/search)
   ↓ Map loads with markers, apply filters
   ↓ Click marker → InfoWindow → "View details"
Spot Details (/driver/spots/:id)
   ↓ Review photos, price, rules, host rating
   ↓ "Book this spot"
Booking Form (/driver/spots/:id/book)
   ↓ Pick start/end time, see live total
   ↓ "Continue to payment"
Booking Review (/driver/checkout/:bookingId)
   ↓ Confirm details
   ↓ "Pay now"
Stripe Payment (/driver/checkout/:bookingId/pay)
   ↓ Enter test card, "Pay"
Payment Success (/driver/checkout/:bookingId/success)
   ↓ Confirmation + booking code + map link
   ↓ "View my bookings"
Booking History (/driver/bookings)
```

### Flow B — Driver completes a session & reviews

```
Booking History (/driver/bookings)
   ↓ Click an "Active" booking
Booking Details (/driver/bookings/:id)
   ↓ Countdown to end_time, host contact, address
   ↓ After end_time → status = "completed"
   ↓ Banner: "How was your experience?"
Write Review (/driver/bookings/:id/review)
   ↓ 1–5 stars, comment, submit
Review Submitted (/driver/bookings/:id/review/done)
   ↓ "Back to bookings"
```

### Flow C — Driver cancels a booking

```
Booking Details (/driver/bookings/:id)
   ↓ "Cancel booking"
Cancel Confirmation (/driver/bookings/:id/cancel)
   ↓ Show policy → "Yes, cancel"
   ↓ status → "cancelled"
Cancellation Done (/driver/bookings/:id/cancelled)
   ↓ Refund note + "Find another spot"
```

### Flow D — First-time Host onboarding & first listing

```
Register (/register)
   ↓ Role = Host
Welcome Host (/host/welcome)
   ↓ 3-step intro: List → Get bookings → Get paid
   ↓ "Add your first spot"
Add Spot — Location (/host/spots/add/location)
   ↓ Drop pin on map OR type address
Add Spot — Details (/host/spots/add/details)
   ↓ Title, vehicle size, rules
Add Spot — Pricing & Availability (/host/spots/add/pricing)
   ↓ Hourly price, available_from, available_to
Add Spot — Review (/host/spots/add/review)
   ↓ Final summary → "Publish"
Spot Published (/host/spots/add/done)
   ↓ "View my spots"
My Spots (/host/spots)
```

### Flow E — Host manages bookings & earnings

```
Host Dashboard (/host)
   ↓ "3 new bookings" card
Host Bookings (/host/bookings)
   ↓ Tabs: Upcoming | Active | Completed | Cancelled
   ↓ Click a booking
Booking Details — Host View (/host/bookings/:id)
   ↓ Driver info, time, earnings
Earnings (/host/earnings)
   ↓ Total + monthly + transaction list
```

### Flow F — Google OAuth login

```
Login (/login)
   ↓ "Continue with Google"
→ Google consent
→ /auth/callback?token=xxx&role=driver
   ↓ Token saved, AuthContext updated
   ↓ Redirect by role: /driver or /host or /admin
```

### Flow G — Admin moderation

```
Login (/login) → /admin
Admin Dashboard (/admin)
   ↓ Stat cards + recent activity
   ↓ "Moderation"
Moderation (/admin/moderation/users  |  /spots  |  /reviews)
   ↓ Click "Delete" → ConfirmDialog → action done
```

---

## 5. Complete Page Breakdown

### Public Portal (`/`)

| Page | Route | Purpose |
|---|---|---|
| Home / Landing | `/` | Hero, value prop, "How it works", featured spots, CTAs |
| About | `/about` | Project info, team, mission |
| How It Works | `/how-it-works` | Explainer for drivers vs hosts |
| Login | `/login` | Email/password + Google OAuth button |
| Register | `/register` | Name, email, password, role selector |
| Forgot Password | `/forgot-password` | Email input + reset request (UI only) |
| Auth Callback | `/auth/callback` | Reads `?token=` from Google redirect, stores it, routes by role |
| 404 Not Found | `*` | Friendly not-found with "Go home" |

### Driver Portal (`/driver`) — gated by role=driver

| Page | Route | Purpose |
|---|---|---|
| Welcome | `/driver/welcome` | One-time onboarding after first login |
| Dashboard | `/driver` | Quick stats, upcoming booking, "Find parking" CTA |
| Search Spots | `/driver/search` | Map + filter sidebar + spot cards list |
| Spot Details | `/driver/spots/:id` | Full spot info, host info, reviews, "Book" CTA |
| Booking Form | `/driver/spots/:id/book` | Pick start/end time, live total calculation |
| Checkout Review | `/driver/checkout/:bookingId` | Final summary before payment |
| Payment | `/driver/checkout/:bookingId/pay` | Stripe Elements card form |
| Payment Success | `/driver/checkout/:bookingId/success` | Confirmation + booking code + map link |
| Payment Failed | `/driver/checkout/:bookingId/failed` | Error state with retry button |
| Booking History | `/driver/bookings` | Tabs: Upcoming / Active / Completed / Cancelled |
| Booking Details | `/driver/bookings/:id` | Countdown, host contact, cancel button |
| Cancel Confirmation | `/driver/bookings/:id/cancel` | Review cancellation policy → confirm |
| Cancellation Done | `/driver/bookings/:id/cancelled` | Success + "Find another spot" |
| Write Review | `/driver/bookings/:id/review` | Star rating + comment |
| Review Submitted | `/driver/bookings/:id/review/done` | Thank-you screen |
| Notifications | `/driver/notifications` | Booking updates, host messages |
| Profile | `/driver/profile` | View profile info |
| Edit Profile | `/driver/profile/edit` | Update name, phone, vehicle info |
| Settings | `/driver/settings` | Password change, delete account, logout |

### Host Portal (`/host`) — gated by role=host

| Page | Route | Purpose |
|---|---|---|
| Welcome | `/host/welcome` | One-time onboarding |
| Dashboard | `/host` | Earnings snapshot, upcoming bookings, "Add new spot" |
| My Spots | `/host/spots` | List of all owned spots with status badges |
| Add Spot — Location | `/host/spots/add/location` | Map pin + address |
| Add Spot — Details | `/host/spots/add/details` | Title, vehicle size, rules |
| Add Spot — Pricing | `/host/spots/add/pricing` | Hourly price + availability |
| Add Spot — Review | `/host/spots/add/review` | Final summary |
| Spot Published | `/host/spots/add/done` | Success screen |
| Edit Spot | `/host/spots/edit/:id` | Single-page edit form |
| Spot Details — Host View | `/host/spots/:id` | Stats: bookings, revenue, rating |
| Delete Spot Confirmation | `/host/spots/:id/delete` | Confirm destructive action |
| Host Bookings | `/host/bookings` | Tabs: Upcoming / Active / Completed / Cancelled |
| Host Booking Details | `/host/bookings/:id` | Driver info, time, earnings |
| Write Review (about Driver) | `/host/bookings/:id/review` | Rate the driver |
| Earnings | `/host/earnings` | Total, monthly, transaction list |
| Transaction Details | `/host/earnings/:transactionId` | Single transaction view |
| Notifications | `/host/notifications` | New bookings, cancellations, reviews |
| Profile | `/host/profile` | View profile + host rating |
| Edit Profile | `/host/profile/edit` | Update name, phone, bio |
| Settings | `/host/settings` | Password, delete account, logout |

### Admin Portal (`/admin`) — gated by role=admin

| Page | Route | Purpose |
|---|---|---|
| Dashboard | `/admin` | Stat cards + recent activity feed |
| Moderation — Users | `/admin/moderation/users` | Searchable user list with delete |
| Moderation — Spots | `/admin/moderation/spots` | Searchable spot list with delete |
| Moderation — Reviews | `/admin/moderation/reviews` | Flag/delete reviews |
| User Details | `/admin/users/:id` | Full user + their activity |
| Spot Details | `/admin/spots/:id` | Full spot + its bookings |
| Delete Confirmation | `/admin/:type/:id/delete` | Reused confirmation page |

---

## 6. Project Structure

```
ParkShare-App/
├─ client/
│  ├─ public/
│  │  ├─ favicon.svg
│  │  └─ logo.svg
│  ├─ src/
│  │  ├─ assets/
│  │  ├─ components/
│  │  │  └─ UI/
│  │  │     ├─ Button.jsx
│  │  │     ├─ Loader.jsx
│  │  │     ├─ Modal.jsx
│  │  │     ├─ ConfirmDialog.jsx
│  │  │     ├─ EmptyState.jsx
│  │  │     ├─ StatusBadge.jsx
│  │  │     ├─ StarRating.jsx
│  │  │     ├─ Stepper.jsx
│  │  │     ├─ Tabs.jsx
│  │  │     └─ Navbar.jsx
│  │  ├─ context/
│  │  │  └─ AuthContext.jsx
│  │  ├─ portals/
│  │  │  ├─ Admin/
│  │  │  │  ├─ components/
│  │  │  │  │  ├─ StatCard.jsx
│  │  │  │  │  ├─ UserRow.jsx
│  │  │  │  │  ├─ SpotRow.jsx
│  │  │  │  │  └─ ReviewRow.jsx
│  │  │  │  ├─ pages/
│  │  │  │  │  ├─ Dashboard.jsx
│  │  │  │  │  ├─ ModerationUsers.jsx
│  │  │  │  │  ├─ ModerationSpots.jsx
│  │  │  │  │  ├─ ModerationReviews.jsx
│  │  │  │  │  ├─ UserDetails.jsx
│  │  │  │  │  └─ SpotDetails.jsx
│  │  │  │  ├─ AdminLayout.jsx
│  │  │  │  └─ AdminRouter.jsx
│  │  │  ├─ Driver/
│  │  │  │  ├─ components/
│  │  │  │  │  ├─ MapView.jsx
│  │  │  │  │  ├─ FilterPanel.jsx
│  │  │  │  │  ├─ SpotCard.jsx
│  │  │  │  │  ├─ BookingForm.jsx
│  │  │  │  │  ├─ BookingCard.jsx
│  │  │  │  │  ├─ CountdownTimer.jsx
│  │  │  │  │  └─ ReviewForm.jsx
│  │  │  │  ├─ pages/
│  │  │  │  │  ├─ Welcome.jsx
│  │  │  │  │  ├─ Dashboard.jsx
│  │  │  │  │  ├─ SearchSpots.jsx
│  │  │  │  │  ├─ SpotDetails.jsx
│  │  │  │  │  ├─ BookSpot.jsx
│  │  │  │  │  ├─ CheckoutReview.jsx
│  │  │  │  │  ├─ Payment.jsx
│  │  │  │  │  ├─ PaymentSuccess.jsx
│  │  │  │  │  ├─ PaymentFailed.jsx
│  │  │  │  │  ├─ BookingHistory.jsx
│  │  │  │  │  ├─ BookingDetails.jsx
│  │  │  │  │  ├─ CancelBooking.jsx
│  │  │  │  │  ├─ CancellationDone.jsx
│  │  │  │  │  ├─ WriteReview.jsx
│  │  │  │  │  ├─ ReviewDone.jsx
│  │  │  │  │  ├─ Notifications.jsx
│  │  │  │  │  ├─ Profile.jsx
│  │  │  │  │  ├─ EditProfile.jsx
│  │  │  │  │  └─ Settings.jsx
│  │  │  │  ├─ DriverLayout.jsx
│  │  │  │  └─ DriverRouter.jsx
│  │  │  ├─ Host/
│  │  │  │  ├─ components/
│  │  │  │  │  ├─ SpotEditor.jsx
│  │  │  │  │  ├─ Calendar.jsx
│  │  │  │  │  ├─ LocationPicker.jsx
│  │  │  │  │  ├─ EarningsCard.jsx
│  │  │  │  │  └─ TransactionRow.jsx
│  │  │  │  ├─ pages/
│  │  │  │  │  ├─ Welcome.jsx
│  │  │  │  │  ├─ Dashboard.jsx
│  │  │  │  │  ├─ MySpots.jsx
│  │  │  │  │  ├─ AddSpotLocation.jsx
│  │  │  │  │  ├─ AddSpotDetails.jsx
│  │  │  │  │  ├─ AddSpotPricing.jsx
│  │  │  │  │  ├─ AddSpotReview.jsx
│  │  │  │  │  ├─ SpotPublished.jsx
│  │  │  │  │  ├─ EditSpot.jsx
│  │  │  │  │  ├─ SpotDetails.jsx
│  │  │  │  │  ├─ DeleteSpot.jsx
│  │  │  │  │  ├─ HostBookings.jsx
│  │  │  │  │  ├─ BookingDetails.jsx
│  │  │  │  │  ├─ WriteReview.jsx
│  │  │  │  │  ├─ Earnings.jsx
│  │  │  │  │  ├─ TransactionDetails.jsx
│  │  │  │  │  ├─ Notifications.jsx
│  │  │  │  │  ├─ Profile.jsx
│  │  │  │  │  ├─ EditProfile.jsx
│  │  │  │  │  └─ Settings.jsx
│  │  │  │  ├─ HostLayout.jsx
│  │  │  │  └─ HostRouter.jsx
│  │  │  └─ Public/
│  │  │     ├─ pages/
│  │  │     │  ├─ Home.jsx
│  │  │     │  ├─ About.jsx
│  │  │     │  ├─ HowItWorks.jsx
│  │  │     │  ├─ Login.jsx
│  │  │     │  ├─ Register.jsx
│  │  │     │  ├─ ForgotPassword.jsx
│  │  │     │  ├─ AuthCallback.jsx
│  │  │     │  └─ NotFound.jsx
│  │  │     ├─ PublicLayout.jsx
│  │  │     └─ PublicRouter.jsx
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  ├─ index.html
│  ├─ tailwind.config.js
│  ├─ postcss.config.js
│  ├─ package.json
│  └─ vite.config.js
└─ server/
   ├─ config/
   │  ├─ db.js
   │  └─ passport.js
   ├─ middleware/
   │  ├─ authMiddleware.js
   │  └─ roleMiddleware.js
   ├─ models/
   │  ├─ Booking.js
   │  ├─ Review.js
   │  ├─ Spot.js
   │  ├─ Transaction.js
   │  └─ User.js
   ├─ schema.sql
   ├─ .env
   ├─ index.js
   └─ package.json
```

---

## 7. Database Schema (PostgreSQL)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  phone VARCHAR(20),
  bio TEXT,
  role VARCHAR(20) NOT NULL CHECK (role IN ('driver', 'host', 'admin')),
  google_id VARCHAR(255),
  onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE spots (
  id SERIAL PRIMARY KEY,
  host_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  hourly_price DECIMAL(10, 2) NOT NULL,
  vehicle_size VARCHAR(50),
  rules TEXT,
  available_from TIME,
  available_to TIME,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  spot_id INTEGER REFERENCES spots(id) ON DELETE CASCADE,
  driver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','paid','active','completed','cancelled')),
  stripe_payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  stripe_id VARCHAR(255),
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  link VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 8. Backend Rules

- All Express setup + every route lives in `server/index.js`.
- `server/config/db.js` exports a single `pg.Pool` instance.
- `server/config/passport.js` configures Google OAuth strategy.
- `server/middleware/authMiddleware.js` verifies JWT, attaches `req.user`.
- `server/middleware/roleMiddleware.js` checks `req.user.role`.
- `server/models/*.js` exports plain async functions wrapping SQL queries.
- Use `app.use(cors())` and `app.use(express.json())`.
- Use `dotenv` for: `DB_USER, DB_PASS, DB_HOST, DB_NAME, DB_PORT, PORT, JWT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, STRIPE_SECRET_KEY, CLIENT_URL`.
- Database name: `parkshare`.

### REST Endpoints

```
AUTH
POST   /api/auth/register          { name, email, password, role }
POST   /api/auth/login             { email, password }
GET    /api/auth/google
GET    /api/auth/google/callback
GET    /api/auth/me
PUT    /api/auth/onboarded         (marks onboarded=true)

USERS
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id

SPOTS
POST   /api/spots
GET    /api/spots                  (filters: ?lat=&lng=&maxPrice=&minRating=)
GET    /api/spots/:id
PUT    /api/spots/:id
DELETE /api/spots/:id
GET    /api/spots/host/:hostId

BOOKINGS
POST   /api/bookings               (with conflict check)
GET    /api/bookings
GET    /api/bookings/:id
PUT    /api/bookings/:id
DELETE /api/bookings/:id
GET    /api/bookings/driver/:driverId
GET    /api/bookings/host/:hostId

REVIEWS
POST   /api/reviews
GET    /api/reviews
GET    /api/reviews/:id
PUT    /api/reviews/:id
DELETE /api/reviews/:id
GET    /api/reviews/user/:userId
GET    /api/reviews/spot/:spotId

TRANSACTIONS
GET    /api/transactions
GET    /api/transactions/:id
GET    /api/transactions/host/:hostId

NOTIFICATIONS
GET    /api/notifications/user/:userId
PUT    /api/notifications/:id      (mark read)
DELETE /api/notifications/:id

PAYMENTS (Stripe test mode)
POST   /api/payments/create-intent { bookingId }
POST   /api/payments/confirm        { bookingId, paymentIntentId }

ADMIN
GET    /api/admin/stats
```

### Booking Conflict Check
Before inserting a booking:
```sql
SELECT id FROM bookings
WHERE spot_id = $1
  AND status IN ('pending','paid','active')
  AND NOT (end_time <= $2 OR start_time >= $3);
```
If any row returned → return 409 Conflict.

---

## 9. Frontend Rules

- `main.jsx` renders `<RouterProvider router={router} />`.
- Routing setup lives in `App.jsx` (using `createBrowserRouter`).
- Each portal has its own `*Router.jsx` exporting child route configs.
- Each `*Layout.jsx` contains the Navbar + `<Outlet />`.
- Pages handle their own form state and Axios calls. No service folders.
- Only `AuthContext` is allowed for global state.
- Hardcode API base: `http://localhost:5000/api`
- Use `alert()` only for trivial confirmations. Major actions (booking, payment, deletion) get a dedicated confirmation page or `<ConfirmDialog />` modal.
- Use `console.error(err)` for errors.
- Controlled inputs: `value={form.field || ""}`.
- Every list page renders `<EmptyState />` when items.length === 0.
- Every loading state renders `<Loader />` while fetching.

---

## 10. CRUD Coding Pattern

### Add page
```jsx
const [form, setForm] = useState({});
const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post("http://localhost:5000/api/spots", form);
    alert("Added successfully!");
  } catch (err) { console.error(err); }
};
```

### List page
```jsx
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);

const fetchItems = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/spots");
    setItems(res.data);
  } catch (err) { console.error(err); }
  finally { setLoading(false); }
};

useEffect(() => { fetchItems(); }, []);

const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/spots/${id}`);
    fetchItems();
  } catch (err) { console.error(err); }
};

if (loading) return <Loader />;
if (items.length === 0) return <EmptyState message="No spots yet" />;
return items.map(item => (...));
```

### Edit page (Postgres — `id`, not `_id`)
```jsx
const { id } = useParams();
const navigate = useNavigate();
const [form, setForm] = useState({});

useEffect(() => {
  axios.get(`http://localhost:5000/api/spots/${id}`)
    .then(res => setForm(res.data))
    .catch(err => console.error(err));
}, [id]);

const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { id: _omit, ...cleanData } = form;
    await axios.put(`http://localhost:5000/api/spots/${id}`, cleanData);
    alert("Updated!");
    navigate("/host/spots");
  } catch (err) { console.error(err); }
};
```

---

## 11. Shared UI Components

| Component | Purpose |
|---|---|
| `Button` | `{children, onClick, variant, disabled}` — primary/secondary/danger |
| `Loader` | Centered spinner |
| `Modal` | `{open, onClose, children}` |
| `ConfirmDialog` | `{open, title, message, onConfirm, onCancel}` |
| `EmptyState` | `{icon, message, ctaText, ctaLink}` |
| `StatusBadge` | `{status}` — colored pill for booking statuses |
| `StarRating` | `{value, onChange, readonly}` — input/display |
| `Stepper` | `{steps, current}` — multi-step Add Spot flow |
| `Tabs` | `{tabs, active, onChange}` — filtered list pages |
| `Navbar` | Role-aware nav with `<Link>`s |

---

## 12. Portal-Specific Components

### Driver
- **MapView** — Google Maps with markers, InfoWindow on click
- **FilterPanel** — max price, min rating, distance, vehicle size
- **SpotCard** — preview card for spot list
- **BookingForm** — start/end pickers, live total
- **BookingCard** — preview card for booking list
- **CountdownTimer** — live countdown to booking start/end
- **ReviewForm** — star rating + textarea

### Host
- **SpotEditor** — all spot fields (used by add + edit)
- **Calendar** — `available_from` / `available_to` time pickers
- **LocationPicker** — Google Map with draggable pin
- **EarningsCard** — total earned summary
- **TransactionRow** — single transaction line

### Admin
- **StatCard** — `{label, value, icon}`
- **UserRow** / **SpotRow** / **ReviewRow** — table rows with delete

---

## 13. Authentication Flow

1. Register/Login → server returns `{ token, user }`. Frontend stores token in `localStorage`, sets it in AuthContext.
2. Axios default header: `axios.defaults.headers.common["Authorization"] = "Bearer " + token`.
3. Google OAuth: button → `GET /api/auth/google` → Google → callback → server signs JWT → redirects to `${CLIENT_URL}/auth/callback?token=...&role=...`. Frontend reads, stores, routes by role.
4. First-time users: `user.onboarded === false` → redirect to `/{role}/welcome`.
5. Protected routes: each `*Router.jsx` checks AuthContext role; wrong role → `/login`.

---

## 14. Stripe Payment Flow (Test Mode)

1. After booking POST returns `status='pending'`, navigate to `/driver/checkout/:bookingId` (review screen).
2. Click "Pay now" → navigate to `/driver/checkout/:bookingId/pay` (Stripe Elements).
3. Page calls `POST /api/payments/create-intent` → server returns `clientSecret`.
4. Client `stripe.confirmCardPayment(clientSecret)`.
5. On success → `POST /api/payments/confirm` → server updates booking `status='paid'`, inserts transaction.
6. Navigate to `/driver/checkout/:bookingId/success`.
7. On failure → `/driver/checkout/:bookingId/failed` with retry.
8. Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

---

## 15. UX Standards (Non-negotiable)

- **Loading:** every async fetch shows `<Loader />` until done.
- **Empty states:** every list shows `<EmptyState />` with CTA when empty.
- **Destructive actions:** deletion/cancellation always go through a dedicated confirmation page or `<ConfirmDialog />` modal.
- **Success feedback:** booking, payment, and publishing actions get their own success page with next-step CTA.
- **Failure recovery:** payment failures get a dedicated page with retry.
- **Multi-step forms:** Add Spot is 4 screens with `<Stepper />`, not one long form.
- **Status visibility:** bookings everywhere show `<StatusBadge />` (pending/paid/active/completed/cancelled).
- **Back navigation:** every nested page has a "Back" link to its parent.
- **Mobile-first:** every page works at 375px width.

---

## 16. Build Order (Suggested for Claude Code)

1. Server scaffold: `index.js`, `db.js`, `.env`, `schema.sql`, run table creation.
2. Models: query helpers in `server/models/*.js`.
3. Auth routes + middleware (register/login/me first; Google OAuth after).
4. Spots CRUD routes.
5. Bookings CRUD + conflict check.
6. Reviews CRUD.
7. Notifications + Transactions routes.
8. Stripe payment routes.
9. Admin stats route.
10. Client scaffold: Vite + Tailwind + router + AuthContext + shared UI components.
11. Public pages: Home, About, How It Works, Login, Register, AuthCallback, NotFound.
12. Host portal — Welcome, Dashboard, MySpots, Add Spot multi-step, EditSpot, HostBookings, Earnings, Notifications, Profile, Settings.
13. Driver portal — Welcome, Dashboard, SearchSpots, SpotDetails, BookSpot, full checkout flow, BookingHistory, BookingDetails, Cancel flow, Review flow, Notifications, Profile, Settings.
14. Admin portal — Dashboard, Moderation tabs, detail views.
15. Polish + deployment.

---

## 17. Environment Variables

`server/.env`:
```
PORT=5000
DB_HOST=...
DB_PORT=5432
DB_USER=...
DB_PASS=...
DB_NAME=parkshare
JWT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:5173
```

`client/.env`:
```
VITE_GOOGLE_MAPS_API_KEY=...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 18. Out of Scope

- Image uploads for spots (use placeholders)
- Real-time chat
- Automatic Stripe refunds (just mark cancelled)
- Email notifications (in-app `notifications` only)
- TypeScript / Redux / Zustand
- ORM (Prisma/Sequelize) — raw `pg` only
- Mobile native apps

---

## 19. Acceptance Checklist

- [ ] Users register as Driver, Host, or Admin.
- [ ] Google OAuth login works.
- [ ] First-time users see Welcome onboarding.
- [ ] Hosts full-CRUD spots via multi-step add flow.
- [ ] Drivers search spots on Google Map with filters.
- [ ] Spot details page shows host rating + reviews.
- [ ] Booking flow: spot → form → review → pay → success.
- [ ] Overlapping bookings rejected with 409.
- [ ] Stripe test payment completes; booking → "paid"; transaction recorded.
- [ ] Cancellation has confirmation + done screens.
- [ ] Both parties review after completion.
- [ ] Notifications page works for both roles.
- [ ] Admin sees stats, can moderate users/spots/reviews.
- [ ] Every list has loading + empty states.
- [ ] App deployed: Vercel + Render + Neon.
- [ ] GitHub repo with meaningful commit history.
