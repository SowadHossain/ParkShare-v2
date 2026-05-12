require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
    `)
  } catch (e) { /* columns may already exist */ }
})()

const app = express()
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.use(passport.initialize())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const sign = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' })

// ── helpers ────────────────────────────────────────────────────────────────
async function createNotification(userId, type, message, link = null) {
  await pool.query(
    'INSERT INTO notifications (user_id, type, message, link) VALUES ($1,$2,$3,$4)',
    [userId, type, message, link]
  )
}

// ══════════════════════════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════════════════════════
// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'name, email, password required' })
    const existing = await User.findByEmail(email)
    if (existing) return res.status(409).json({ message: 'Email already in use' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash, phone, role: role || 'driver' })
    const token = sign(user)
    const { password_hash: _ph, ...safeUser } = user
    res.status(201).json({ token, user: safeUser })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
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
    const user = await User.update(req.params.id, req.body)
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.delete('/api/users/:id', auth, requireRole('admin'), async (req, res) => {
  try {
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
    const { lat, lng, maxPrice, minRating, vehicleSize } = req.query
    const spots = await Spot.search({
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      minRating: minRating ? parseFloat(minRating) : null,
      vehicleSize: vehicleSize || null,
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
    await Spot.delete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// ══════════════════════════════════════════════════════════════════════════
// BOOKINGS
// ══════════════════════════════════════════════════════════════════════════
app.post('/api/bookings', auth, requireRole('driver'), async (req, res) => {
  try {
    const { spotId, startTime, endTime } = req.body
    const spot = await Spot.findById(spotId)
    if (!spot) return res.status(404).json({ message: 'Spot not found' })

    const conflict = await Booking.checkConflict(spotId, startTime, endTime)
    if (conflict) return res.status(409).json({ message: 'Time slot not available' })

    const hours = (new Date(endTime) - new Date(startTime)) / 3600000
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
    const bookings = await Booking.getByHost(req.params.hostId)
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/bookings/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Not found' })
    if (booking.driver_id !== req.user.id && booking.host_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }
    res.json(booking)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.patch('/api/bookings/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Not found' })
    if (booking.driver_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })
    if (!['pending', 'paid'].includes(booking.status)) return res.status(400).json({ message: 'Cannot cancel' })
    const updated = await Booking.updateStatus(req.params.id, 'cancelled')
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
    const booking = await Booking.findById(bookingId)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    if (booking.status !== 'completed') return res.status(400).json({ message: 'Booking not completed' })
    const already = await Review.existsForBooking(bookingId, req.user.id)
    if (already) return res.status(409).json({ message: 'Review already submitted' })
    const review = await Review.create({ bookingId, reviewerId: req.user.id, revieweeId, rating, comment })
    await createNotification(revieweeId, 'new_review', `You received a ${rating}★ review.`)
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
      return res.status(400).json({ message: 'Payment not completed' })
    }

    await Booking.updateStatus(bookingId, 'paid', stripePaymentId)
    await Transaction.create({ bookingId, amount: booking.total_price, stripeId: stripePaymentId })
    await createNotification(booking.host_id, 'new_booking', `New booking for ${booking.spot_title} — $${booking.total_price}`, `/host/bookings/${bookingId}`)
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

// ══════════════════════════════════════════════════════════════════════════
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`ParkShare API running on port ${PORT}`))
