require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')
const passport = require('./config/passport')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const pool = require('./config/db')
const User = require('./models/User')
const Spot = require('./models/Spot')
const Booking = require('./models/Booking')
const Review = require('./models/Review')
const Transaction = require('./models/Transaction')
const auth = require('./middleware/authMiddleware')
const requireRole = require('./middleware/roleMiddleware')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// ── Upload directories ─────────────────────────────────────────────────────
;['uploads/avatars', 'uploads/spots'].forEach(d =>
  fs.mkdirSync(path.join(__dirname, d), { recursive: true })
)

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, req.uploadDir || 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Images only')),
})

// ── DB migrations for new columns ──────────────────────────────────────────
;(async () => {
  try {
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
      ALTER TABLE spots ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT ARRAY[]::TEXT[];
      ALTER TABLE users ADD COLUMN IF NOT EXISTS nid VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS license_plate VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(20) NOT NULL DEFAULT 'pending';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS vehicle_make VARCHAR(80);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS vehicle_model VARCHAR(80);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS vehicle_color VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS vehicle_size VARCHAR(20);
      CREATE UNIQUE INDEX IF NOT EXISTS transactions_stripe_id_key ON transactions (stripe_id);
      CREATE TABLE IF NOT EXISTS kyc_whitelist (
        id           SERIAL PRIMARY KEY,
        type         VARCHAR(20) NOT NULL CHECK (type IN ('nid','license_plate')),
        value        VARCHAR(100) NOT NULL UNIQUE,
        note         TEXT,
        added_by     INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      ALTER TABLE kyc_whitelist ADD COLUMN IF NOT EXISTS nid_id INTEGER REFERENCES kyc_whitelist(id) ON DELETE SET NULL;
    `)
    // Extend booking status check constraint to include approved/rejected
    await pool.query(`
      ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
      ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
        CHECK (status IN ('pending','approved','rejected','paid','active','completed','cancelled'));
    `)
  } catch (e) { /* columns may already exist */ }
})()

const app = express()
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.use(passport.initialize())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { message: 'Too many attempts, try again in 15 minutes' } })
const registerLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: { message: 'Too many registrations from this IP' } })

const sign = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' })

// ── helpers ────────────────────────────────────────────────────────────────
async function createNotification(userId, type, message, link = null) {
  await pool.query(
    'INSERT INTO notifications (user_id, type, message, link) VALUES ($1,$2,$3,$4)',
    [userId, type, message, link]
  )
}

async function transitionBookings() {
  await pool.query(`
    UPDATE bookings SET status = 'active'
    WHERE status = 'paid' AND start_time <= NOW() AND end_time > NOW();
    UPDATE bookings SET status = 'completed'
    WHERE status IN ('paid', 'active') AND end_time <= NOW();
    UPDATE bookings SET status = 'cancelled'
    WHERE status = 'approved' AND start_time < NOW();
  `)
}

// ══════════════════════════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════════════════════════
// POST /api/auth/register
app.post('/api/auth/register', registerLimiter, async (req, res) => {
  try {
    const { name, email, password, phone, role, nid, license_plate } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'name, email, password required' })

    // Public registration is limited to driver/host — never admin
    const safeRole = role === 'host' ? 'host' : 'driver'

    if (!nid) return res.status(400).json({ message: 'NID number is required' })
    const nidRow = await pool.query(
      `SELECT id FROM kyc_whitelist WHERE type = 'nid' AND LOWER(value) = LOWER($1)`, [nid]
    )
    if (!nidRow.rows.length) return res.status(403).json({ message: 'NID not found in our approved database. Contact support.' })
    const nidEntryId = nidRow.rows[0].id

    if (safeRole === 'driver') {
      if (!license_plate) return res.status(400).json({ message: 'License plate is required for drivers' })
      const plateRow = await pool.query(
        `SELECT id FROM kyc_whitelist
         WHERE type = 'license_plate' AND LOWER(value) = LOWER($1)
           AND (nid_id = $2 OR nid_id IS NULL)`,
        [license_plate, nidEntryId]
      )
      if (!plateRow.rows.length) return res.status(403).json({ message: 'License plate is not registered under this NID. Contact support.' })
    }

    const existing = await User.findByEmail(email)
    if (existing) return res.status(409).json({ message: 'Email already in use' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash, phone, role: safeRole, nid, license_plate: safeRole === 'driver' ? license_plate : null, kyc_status: 'approved' })
    const token = sign(user)
    const { password_hash: _ph, ...safeUser } = user
    res.status(201).json({ token, user: safeUser })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/login
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findByEmail(email)
    if (!user || !user.password_hash) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
    const token = sign(user)
    const { password_hash: _ph, ...safeUser } = user
    res.json({ token, user: safeUser })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/auth/me
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    const { password_hash, ...safe } = user
    res.json(safe)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/onboarded
app.post('/api/auth/onboarded', auth, async (req, res) => {
  try {
    const user = await User.markOnboarded(req.user.id)
    res.json({ onboarded: user.onboarded })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Google OAuth
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))

app.get('/api/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth` }),
  (req, res) => {
    const token = sign(req.user)
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/callback?token=${token}&role=${req.user.role}`)
  }
)

// ══════════════════════════════════════════════════════════════════════════
// USERS
// ══════════════════════════════════════════════════════════════════════════
app.get('/api/users', auth, requireRole('admin'), async (req, res) => {
  try {
    const { role, search } = req.query
    const users = await User.getAll({ role, search })
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/users/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    const { password_hash, ...safe } = user
    // Non-owners/non-admins only get public fields
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
      const { id, name, avatar_url, bio, role, avg_rating, created_at } = safe
      return res.json({ id, name, avatar_url, bio, role, avg_rating, created_at })
    }
    res.json(safe)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.put('/api/users/:id', auth, async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const { currentPassword, password, ...profileFields } = req.body

    // Handle password change
    if (password) {
      if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' })
      const existing = await User.findById(req.params.id)
      if (!existing) return res.status(404).json({ message: 'User not found' })
      if (existing.password_hash) {
        if (!currentPassword) return res.status(400).json({ message: 'Current password required' })
        const valid = await bcrypt.compare(currentPassword, existing.password_hash)
        if (!valid) return res.status(401).json({ message: 'Current password is incorrect' })
      }
      const newHash = await bcrypt.hash(password, 10)
      await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, req.params.id])
    }

    // Handle profile field updates
    let updated = await User.findById(req.params.id)
    if (Object.keys(profileFields).length > 0) {
      updated = await User.update(req.params.id, profileFields) || updated
    }

    const { password_hash, ...safe } = updated
    res.json(safe)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.delete('/api/users/:id', auth, async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }
    await User.delete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// ══════════════════════════════════════════════════════════════════════════
// SPOTS
// ══════════════════════════════════════════════════════════════════════════
app.get('/api/spots', async (req, res) => {
  try {
    const { lat, lng, maxPrice, minRating, vehicleSize, startTime, endTime } = req.query
    const spots = await Spot.search({
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      minRating: minRating ? parseFloat(minRating) : null,
      vehicleSize: vehicleSize || null,
      startTime: startTime || null,
      endTime: endTime || null,
    })
    res.json(spots)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/spots/all', auth, requireRole('admin'), async (req, res) => {
  try {
    const spots = await Spot.getAll()
    res.json(spots)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/spots/host/:hostId', auth, async (req, res) => {
  try {
    const spots = await Spot.getByHost(req.params.hostId)
    res.json(spots)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/spots/:id', async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id)
    if (!spot) return res.status(404).json({ message: 'Spot not found' })
    res.json(spot)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/api/spots', auth, requireRole('host', 'admin'), async (req, res) => {
  try {
    const { title, description, address, latitude, longitude, hourlyPrice, vehicleSize, rules, availableFrom, availableTo } = req.body
    if (!title || !address || latitude == null || longitude == null || !hourlyPrice) {
      return res.status(400).json({ message: 'title, address, latitude, longitude, hourlyPrice required' })
    }
    if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      return res.status(400).json({ message: 'latitude and longitude must be numbers' })
    }
    if (parseFloat(hourlyPrice) <= 0) return res.status(400).json({ message: 'hourlyPrice must be positive' })
    const spot = await Spot.create({
      hostId: req.user.id, title, description, address,
      latitude, longitude, hourlyPrice, vehicleSize, rules, availableFrom, availableTo,
    })
    res.status(201).json(spot)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.put('/api/spots/:id', auth, requireRole('host', 'admin'), async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id)
    if (!spot) return res.status(404).json({ message: 'Not found' })
    if (spot.host_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })
    const updated = await Spot.update(req.params.id, req.body)
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.patch('/api/spots/:id', auth, requireRole('host', 'admin'), async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id)
    if (!spot) return res.status(404).json({ message: 'Not found' })
    if (spot.host_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })
    const updated = await Spot.update(req.params.id, req.body)
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.delete('/api/spots/:id', auth, requireRole('host', 'admin'), async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id)
    if (!spot) return res.status(404).json({ message: 'Not found' })
    if (spot.host_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }
    await Spot.delete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// ══════════════════════════════════════════════════════════════════════════
// BOOKINGS
// ══════════════════════════════════════════════════════════════════════════

// GET /api/spots/:id/booked-slots?date=YYYY-MM-DD
app.get('/api/spots/:id/booked-slots', async (req, res) => {
  try {
    const { date } = req.query
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: 'date query param required (YYYY-MM-DD)' })
    }
    const dayStart = new Date(date + 'T00:00:00+06:00')
    const dayEnd   = new Date(date + 'T23:59:59+06:00')
    const { rows } = await pool.query(
      `SELECT start_time, end_time FROM bookings
       WHERE spot_id = $1
         AND status IN ('approved','paid','active')
         AND start_time < $3
         AND end_time   > $2`,
      [req.params.id, dayStart.toISOString(), dayEnd.toISOString()]
    )
    res.json(rows.map(r => ({ start: r.start_time, end: r.end_time })))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/api/bookings', auth, requireRole('driver'), async (req, res) => {
  try {
    const { spotId, startTime, endTime } = req.body
    if (!spotId || !startTime || !endTime) return res.status(400).json({ message: 'spotId, startTime, endTime required' })
    const start = new Date(startTime), end = new Date(endTime)
    if (isNaN(start) || isNaN(end)) return res.status(400).json({ message: 'Invalid date format' })
    if (start >= end) return res.status(400).json({ message: 'endTime must be after startTime' })
    if (start < new Date()) return res.status(400).json({ message: 'startTime must be in the future' })
    const hours = (end - start) / 3600000
    if (hours < 1) return res.status(400).json({ message: 'Minimum booking is 1 hour' })
    if (hours > 720) return res.status(400).json({ message: 'Booking cannot exceed 30 days' })

    // Validate 15-minute alignment (BDT)
    const startMinBDT = (start.getUTCHours() * 60 + start.getUTCMinutes() + 6 * 60) % (24 * 60)
    const endMinBDT   = (end.getUTCHours()   * 60 + end.getUTCMinutes()   + 6 * 60) % (24 * 60)
    if (startMinBDT % 15 !== 0 || endMinBDT % 15 !== 0) {
      return res.status(400).json({ message: 'Times must be on 15-minute boundaries' })
    }

    const spot = await Spot.findById(spotId)
    if (!spot) return res.status(404).json({ message: 'Spot not found' })

    // Validate against spot's available window
    if (spot.available_from && spot.available_to) {
      const [fh, fm] = spot.available_from.split(':').map(Number)
      const [th, tm] = spot.available_to.split(':').map(Number)
      const fromMin = fh * 60 + fm
      const toMin   = th * 60 + tm
      if (startMinBDT < fromMin || endMinBDT > toMin) {
        return res.status(400).json({ message: `Spot is only available ${spot.available_from.slice(0,5)} – ${spot.available_to.slice(0,5)}` })
      }
    }

    const conflict = await Booking.checkConflict(spotId, startTime, endTime)
    if (conflict) return res.status(409).json({ message: 'Time slot not available' })

    const totalPrice = parseFloat((hours * parseFloat(spot.hourly_price)).toFixed(2))
    const booking = await Booking.create({ spotId, driverId: req.user.id, startTime, endTime, totalPrice })
    res.status(201).json(booking)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/bookings/driver/:driverId', auth, async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.driverId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }
    await transitionBookings()
    const bookings = await Booking.getByDriver(req.params.driverId)
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/bookings/host/:hostId', auth, async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.hostId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }
    await transitionBookings()
    const bookings = await Booking.getByHost(req.params.hostId)
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/bookings/:id', auth, async (req, res) => {
  try {
    await transitionBookings()
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Not found' })
    if (booking.driver_id !== req.user.id && booking.host_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }
    const has_my_review = await Review.existsForBooking(booking.id, req.user.id)
    res.json({ ...booking, has_my_review })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/bookings/:id/approve — host only
app.post('/api/bookings/:id/approve', auth, requireRole('host'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Not found' })
    if (booking.host_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' })
    if (booking.status !== 'pending') return res.status(400).json({ message: 'Only pending bookings can be approved' })

    const conflict = await Booking.checkConflict(booking.spot_id, booking.start_time, booking.end_time, booking.id)
    if (conflict) return res.status(409).json({ message: 'Another booking already approved for this slot' })

    await Booking.updateStatus(booking.id, 'approved')
    await createNotification(
      booking.driver_id, 'booking_approved',
      `Your booking at ${booking.spot_title} was approved! Proceed to payment.`,
      `/driver/bookings/${booking.id}`
    )
    res.json({ message: 'Booking approved' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/bookings/:id/reject — host only
app.post('/api/bookings/:id/reject', auth, requireRole('host'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Not found' })
    if (booking.host_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' })
    if (booking.status !== 'pending') return res.status(400).json({ message: 'Only pending bookings can be rejected' })

    await Booking.updateStatus(booking.id, 'rejected')
    await createNotification(
      booking.driver_id, 'booking_rejected',
      `Your booking request at ${booking.spot_title} was not approved.`,
      `/driver/bookings/${booking.id}`
    )
    res.json({ message: 'Booking rejected' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.patch('/api/bookings/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Not found' })
    if (booking.driver_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })
    if (!['pending', 'approved', 'paid'].includes(booking.status)) return res.status(400).json({ message: 'Cannot cancel' })
    const updated = await Booking.updateStatus(req.params.id, 'cancelled')
    // Issue Stripe refund if the booking was already paid
    if (booking.stripe_payment_id) {
      try {
        await stripe.refunds.create({ payment_intent: booking.stripe_payment_id })
        await createNotification(booking.driver_id, 'payment_refunded', `Refund issued for your booking at ${booking.spot_title}.`, `/driver/bookings/${booking.id}`)
      } catch (refundErr) {
        console.error('Stripe refund failed:', refundErr.message)
      }
    }
    await createNotification(booking.host_id, 'booking_cancelled', `Booking for ${booking.spot_title} was cancelled.`, `/host/bookings/${booking.id}`)
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/bookings/check-conflict', async (req, res) => {
  try {
    const { spotId, startTime, endTime } = req.query
    const conflict = await Booking.checkConflict(spotId, startTime, endTime)
    res.json({ conflict })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// ══════════════════════════════════════════════════════════════════════════
// REVIEWS
// ══════════════════════════════════════════════════════════════════════════
app.post('/api/reviews', auth, async (req, res) => {
  try {
    const { bookingId, revieweeId, rating, comment } = req.body
    if (!bookingId || !revieweeId || rating == null) return res.status(400).json({ message: 'bookingId, revieweeId, rating required' })
    const r = parseInt(rating)
    if (isNaN(r) || r < 1 || r > 5) return res.status(400).json({ message: 'rating must be 1–5' })
    const booking = await Booking.findById(bookingId)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    if (booking.status !== 'completed') return res.status(400).json({ message: 'Booking not completed' })
    if (revieweeId !== booking.host_id && revieweeId !== booking.driver_id) {
      return res.status(400).json({ message: 'revieweeId must be a party to this booking' })
    }
    const already = await Review.existsForBooking(bookingId, req.user.id)
    if (already) return res.status(409).json({ message: 'Review already submitted' })
    const review = await Review.create({ bookingId, reviewerId: req.user.id, revieweeId, rating, comment })
    const reviewLink = revieweeId === booking.host_id
      ? `/host/bookings/${bookingId}`
      : `/driver/bookings/${bookingId}`
    await createNotification(revieweeId, 'new_review', `You received a ${rating}★ review.`, reviewLink)
    res.status(201).json(review)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/reviews/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.getByUser(req.params.userId)
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/reviews/spot/:spotId', async (req, res) => {
  try {
    const reviews = await Review.getBySpot(req.params.spotId)
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.delete('/api/reviews/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    await Review.delete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/reviews', auth, requireRole('admin'), async (req, res) => {
  try {
    const reviews = await Review.getAll()
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// ══════════════════════════════════════════════════════════════════════════
// TRANSACTIONS
// ══════════════════════════════════════════════════════════════════════════
app.get('/api/transactions/host/:hostId', auth, async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.hostId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }
    const txns = await Transaction.getByHost(req.params.hostId)
    res.json(txns)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/transactions/:id', auth, async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id)
    if (!txn) return res.status(404).json({ message: 'Not found' })
    if (req.user.role !== 'admin') {
      const { rows } = await pool.query(
        `SELECT b.driver_id, s.host_id FROM bookings b
         JOIN spots s ON s.id = b.spot_id WHERE b.id = $1`,
        [txn.booking_id]
      )
      if (!rows.length || (req.user.id !== rows[0].host_id && req.user.id !== rows[0].driver_id)) {
        return res.status(403).json({ message: 'Forbidden' })
      }
    }
    res.json(txn)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// ══════════════════════════════════════════════════════════════════════════
// UPLOADS
// ══════════════════════════════════════════════════════════════════════════
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000'

app.post('/api/upload/avatar', auth, (req, res, next) => { req.uploadDir = 'uploads/avatars'; next() },
  upload.single('avatar'), async (req, res) => {
    try {
      // Delete old avatar file if it was uploaded to this server
      const existing = await User.findById(req.user.id)
      if (existing?.avatar_url?.startsWith(SERVER_URL)) {
        const oldFile = path.join(__dirname, existing.avatar_url.replace(SERVER_URL, ''))
        fs.unlink(oldFile, () => {})
      }
      const url = `${SERVER_URL}/uploads/avatars/${req.file.filename}`
      await User.update(req.user.id, { avatar_url: url })
      res.json({ url })
    } catch (err) { res.status(500).json({ message: 'Upload failed' }) }
  }
)

app.post('/api/spots/:id/images', auth, (req, res, next) => { req.uploadDir = 'uploads/spots'; next() },
  upload.array('images', 5), async (req, res) => {
    try {
      const urls = req.files.map(f => `${SERVER_URL}/uploads/spots/${f.filename}`)
      const { rows } = await pool.query(
        'UPDATE spots SET images = images || $1 WHERE id = $2 RETURNING images',
        [urls, req.params.id]
      )
      res.json({ images: rows[0].images })
    } catch (err) { res.status(500).json({ message: 'Upload failed' }) }
  }
)

// ══════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════════════════════════════════════
app.get('/api/notifications', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.patch('/api/notifications/:id/read', auth, async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id])
    res.json({ message: 'Marked read' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.patch('/api/notifications/read-all', auth, async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = true WHERE user_id = $1', [req.user.id])
    res.json({ message: 'All marked read' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.delete('/api/notifications/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM notifications WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id])
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// ══════════════════════════════════════════════════════════════════════════
// PAYMENTS (Stripe)
// ══════════════════════════════════════════════════════════════════════════
app.post('/api/payments/create-intent', auth, async (req, res) => {
  try {
    const { bookingId } = req.body
    const booking = await Booking.findById(bookingId)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    if (booking.driver_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(booking.total_price * 100),
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: { bookingId: String(bookingId) },
    })
    res.json({ clientSecret: intent.client_secret })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Payment error' })
  }
})

app.post('/api/payments/confirm', auth, async (req, res) => {
  try {
    const { bookingId, stripePaymentId } = req.body
    const booking = await Booking.findById(bookingId)
    if (!booking) return res.status(404).json({ message: 'Not found' })

    const intent = await stripe.paymentIntents.retrieve(stripePaymentId)
    if (intent.status !== 'succeeded') {
      await createNotification(booking.driver_id, 'payment_failed', `Payment failed for ${booking.spot_title}. Please retry.`, `/driver/checkout/${bookingId}`)
      return res.status(400).json({ message: 'Payment not completed' })
    }

    // Idempotency guard — if this Stripe payment was already processed, return success without duplicating
    const existingTxn = await Transaction.getByStripeId(stripePaymentId)
    if (existingTxn) return res.json({ message: 'Payment already confirmed' })

    await Booking.updateStatus(bookingId, 'paid', stripePaymentId)
    await Transaction.create({ bookingId, amount: booking.total_price, stripeId: stripePaymentId })
    await createNotification(booking.host_id, 'new_booking', `New booking for ${booking.spot_title} — ৳${booking.total_price}`, `/host/bookings/${bookingId}`)
    await createNotification(booking.driver_id, 'payment_confirmed', `Payment confirmed for ${booking.spot_title}`, `/driver/bookings/${bookingId}`)

    res.json({ message: 'Payment confirmed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ══════════════════════════════════════════════════════════════════════════
// ADMIN
// ══════════════════════════════════════════════════════════════════════════
app.get('/api/admin/stats', auth, requireRole('admin'), async (req, res) => {
  try {
    const [users, allSpots, activeSpots, allBookings, pendingBookings, completedBookings, revenue] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM spots'),
      pool.query('SELECT COUNT(*) FROM spots WHERE is_active = true'),
      pool.query('SELECT COUNT(*) FROM bookings'),
      pool.query("SELECT COUNT(*) FROM bookings WHERE status = 'pending'"),
      pool.query("SELECT COUNT(*) FROM bookings WHERE status = 'completed'"),
      pool.query("SELECT COALESCE(SUM(amount),0) AS total FROM transactions WHERE status = 'paid'"),
    ])
    res.json({
      total_users: parseInt(users.rows[0].count),
      total_spots: parseInt(allSpots.rows[0].count),
      active_spots: parseInt(activeSpots.rows[0].count),
      total_bookings: parseInt(allBookings.rows[0].count),
      pending_bookings: parseInt(pendingBookings.rows[0].count),
      completed_bookings: parseInt(completedBookings.rows[0].count),
      total_revenue: parseFloat(revenue.rows[0].total),
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/admin/bookings', auth, requireRole('admin'), async (req, res) => {
  try {
    await transitionBookings()
    const { status, limit = 100, offset = 0 } = req.query
    let q = `SELECT b.*, s.title AS spot_title, d.name AS driver_name, h.name AS host_name
             FROM bookings b
             JOIN spots s ON s.id = b.spot_id
             JOIN users d ON d.id = b.driver_id
             JOIN users h ON h.id = s.host_id`
    const vals = []
    if (status) { q += ` WHERE b.status = $1`; vals.push(status) }
    q += ` ORDER BY b.created_at DESC LIMIT $${vals.length + 1} OFFSET $${vals.length + 2}`
    vals.push(parseInt(limit), parseInt(offset))
    const { rows } = await pool.query(q, vals)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// ══════════════════════════════════════════════════════════════════════════
// KYC WHITELIST (admin only)
// ══════════════════════════════════════════════════════════════════════════
app.get('/api/admin/kyc', auth, requireRole('admin'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT k.*, u.name AS added_by_name, n.value AS linked_nid
       FROM kyc_whitelist k
       LEFT JOIN users u ON u.id = k.added_by
       LEFT JOIN kyc_whitelist n ON n.id = k.nid_id
       ORDER BY k.created_at DESC`
    )
    res.json(rows)
  } catch (err) { res.status(500).json({ message: 'Server error' }) }
})

app.post('/api/admin/kyc', auth, requireRole('admin'), async (req, res) => {
  try {
    const { type, value, note, linkedNid } = req.body
    if (!type || !value) return res.status(400).json({ message: 'type and value required' })
    if (!['nid', 'license_plate'].includes(type)) return res.status(400).json({ message: 'type must be nid or license_plate' })

    let nidId = null
    if (type === 'license_plate' && linkedNid) {
      const nidRow = await pool.query(
        `SELECT id FROM kyc_whitelist WHERE type = 'nid' AND LOWER(value) = LOWER($1)`,
        [linkedNid.trim()]
      )
      if (!nidRow.rows.length) return res.status(400).json({ message: `NID "${linkedNid}" not found in whitelist` })
      nidId = nidRow.rows[0].id
    }

    const { rows } = await pool.query(
      `INSERT INTO kyc_whitelist (type, value, note, added_by, nid_id) VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (value) DO NOTHING RETURNING *`,
      [type, value.trim().toUpperCase(), note || null, req.user.id, nidId]
    )
    if (!rows.length) return res.status(409).json({ message: 'This value already exists in the whitelist' })
    res.status(201).json(rows[0])
  } catch (err) { res.status(500).json({ message: 'Server error' }) }
})

app.delete('/api/admin/kyc/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM kyc_whitelist WHERE id = $1', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ message: 'Server error' }) }
})

// ══════════════════════════════════════════════════════════════════════════
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`ParkShare API running on port ${PORT}`))
