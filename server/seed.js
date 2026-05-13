require('dotenv').config()
const bcrypt = require('bcrypt')
const pool = require('./config/db')

const DEMO_USERS = [
  {
    name: 'Rafiq Ahmed',
    email: 'driver@demo.com',
    password: 'password123',
    role: 'driver',
    onboarded: true,
    phone: '01700-123456'
  },
  {
    name: 'Mrs. Khan',
    email: 'host@demo.com',
    password: 'password123',
    role: 'host',
    onboarded: true,
    phone: '01700-654321',
    bio: 'Friendly homeowner with secure driveway in Gulshan'
  },
  {
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'password123',
    role: 'admin',
    onboarded: true
  }
]

const DEMO_SPOTS = [
  {
    hostEmail: 'host@demo.com',
    title: 'Spacious Driveway in Gulshan',
    description: 'Secure, well-lit driveway. Perfect for sedans and SUVs. Free water, 24/7 security.',
    address: '45 Road 47, Gulshan, Dhaka',
    latitude: 23.7961,
    longitude: 90.4113,
    hourlyPrice: 150,
    vehicleSize: 'sedan',
    rules: 'No smoking. Quiet hours 10pm-7am. No repairs on property.',
    availableFrom: '06:00:00',
    availableTo: '23:00:00'
  },
  {
    hostEmail: 'host@demo.com',
    title: 'Secure Parking - Banani',
    description: 'Corner driveway, 24/7 CCTV, gated. Fits sedans only.',
    address: '12 Road 10, Banani, Dhaka',
    latitude: 23.8103,
    longitude: 90.3735,
    hourlyPrice: 200,
    vehicleSize: 'sedan',
    rules: 'Keep vehicle locked. No loud music.',
    availableFrom: '05:00:00',
    availableTo: '22:00:00'
  },
  {
    hostEmail: 'host@demo.com',
    title: 'Large Garage - Dhanmondi',
    description: 'Indoor covered parking, fits SUVs and small trucks. Climate controlled.',
    address: '88 Road 5, Dhanmondi, Dhaka',
    latitude: 23.7432,
    longitude: 90.3703,
    hourlyPrice: 250,
    vehicleSize: 'suv',
    rules: 'No dripping oil. Check-in by 6pm.',
    availableFrom: '06:00:00',
    availableTo: '21:00:00'
  }
]

const KYC_WHITELIST = [
  { type: 'nid', value: '1234567890', note: 'Demo driver NID' },
  { type: 'nid', value: '9876543210', note: 'Demo host NID' },
  { type: 'nid', value: '1111222233', note: 'Extra test NID' },
  { type: 'license_plate', value: 'DHK-1234', note: 'Demo driver plate' },
  { type: 'license_plate', value: 'CTG-5678', note: 'Extra test plate' },
  { type: 'license_plate', value: 'SYL-9999', note: 'Extra test plate' },
]

async function seed() {
  try {
    console.log('🌱 Seeding demo data...\n')

    // Seed KYC whitelist
    console.log('🪪 Seeding KYC whitelist...')
    for (const entry of KYC_WHITELIST) {
      await pool.query(
        `INSERT INTO kyc_whitelist (type, value, note) VALUES ($1, $2, $3) ON CONFLICT (value) DO NOTHING`,
        [entry.type, entry.value.toUpperCase(), entry.note]
      )
      console.log(`  ✅ ${entry.type.toUpperCase()}: ${entry.value}`)
    }

    // Seed users
    console.log('\n📝 Seeding users...')
    const userMap = {}
    for (const user of DEMO_USERS) {
      const passwordHash = await bcrypt.hash(user.password, 10)
      const res = await pool.query(
        `INSERT INTO users (name, email, password_hash, phone, bio, role, onboarded)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
         RETURNING id, email, role`,
        [user.name, user.email, passwordHash, user.phone || null, user.bio || null, user.role, user.onboarded]
      )
      userMap[user.email] = res.rows[0].id
      console.log(`  ✅ ${user.role.toUpperCase()}: ${user.email}`)
    }
    await pool.query(`UPDATE users SET onboarded = true WHERE onboarded = false`)

    // Skip spots/bookings/reviews if demo data already exists
    const { rows: existingSpots } = await pool.query(
      `SELECT id FROM spots WHERE host_id = $1 LIMIT 1`,
      [userMap['host@demo.com']]
    )
    if (existingSpots.length > 0) {
      console.log('\n⏭️  Demo spots/bookings/reviews already exist — skipping.')
      console.log('\n✨ Seed complete (existing data preserved)\n')
      return
    }

    // Seed spots
    console.log('\n🅿️  Seeding spots...')
    const spotMap = {}
    for (const spot of DEMO_SPOTS) {
      const hostId = userMap[spot.hostEmail]
      const res = await pool.query(
        `INSERT INTO spots (host_id, title, description, address, latitude, longitude, hourly_price, vehicle_size, rules, available_from, available_to, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)
         RETURNING id, title`,
        [hostId, spot.title, spot.description, spot.address, spot.latitude, spot.longitude, spot.hourlyPrice, spot.vehicleSize, spot.rules, spot.availableFrom, spot.availableTo]
      )
      spotMap[spot.title] = res.rows[0].id
      console.log(`  ✅ ${spot.title}`)
    }

    // Seed bookings
    console.log('\n📅 Seeding bookings...')
    const driverId = userMap['driver@demo.com']
    const now = new Date()
    const d = (offsetDays, h, m = 0) => {
      const t = new Date(now)
      t.setDate(t.getDate() + offsetDays)
      t.setHours(h, m, 0, 0)
      return t.toISOString()
    }

    const bookings = [
      { spotId: spotMap['Spacious Driveway in Gulshan'], driverId, startTime: d(-2, 9), endTime: d(-2, 14), totalPrice: 750, status: 'completed' },
      { spotId: spotMap['Secure Parking - Banani'], driverId, startTime: d(-1, 8), endTime: d(-1, 10), totalPrice: 400, status: 'completed' },
      { spotId: spotMap['Large Garage - Dhanmondi'], driverId, startTime: d(1, 8), endTime: d(1, 17), totalPrice: 2250, status: 'paid' },
      { spotId: spotMap['Spacious Driveway in Gulshan'], driverId, startTime: d(2, 10), endTime: d(2, 12), totalPrice: 300, status: 'pending' },
    ]

    const bookingIds = []
    for (const booking of bookings) {
      const res = await pool.query(
        `INSERT INTO bookings (spot_id, driver_id, start_time, end_time, total_price, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [booking.spotId, booking.driverId, booking.startTime, booking.endTime, booking.totalPrice, booking.status]
      )
      bookingIds.push({ id: res.rows[0].id, ...booking })
      console.log(`  ✅ Booking: ${booking.status} - ৳${booking.totalPrice}`)
    }

    // Seed transactions for paid/completed bookings
    console.log('\n💳 Seeding transactions...')
    for (const booking of bookingIds) {
      if (booking.status === 'paid' || booking.status === 'completed') {
        await pool.query(
          `INSERT INTO transactions (booking_id, amount, status) VALUES ($1, $2, 'paid')`,
          [booking.id, booking.totalPrice]
        )
        console.log(`  ✅ Transaction: ৳${booking.totalPrice}`)
      }
    }

    // Seed reviews (only for completed bookings)
    console.log('\n⭐ Seeding reviews...')
    const hostId = userMap['host@demo.com']
    const completedBookings = bookingIds.filter(b => b.status === 'completed')

    await pool.query(
      `INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment)
       VALUES ($1, $2, $3, 5, 'Amazing spot! Secure and clean. Very responsive host.')
       ON CONFLICT (booking_id, reviewer_id) DO NOTHING`,
      [completedBookings[0].id, driverId, hostId]
    )
    console.log(`  ✅ Driver ⭐⭐⭐⭐⭐ → Host`)

    await pool.query(
      `INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment)
       VALUES ($1, $2, $3, 5, 'Excellent driver! Very respectful, left the spot clean.')
       ON CONFLICT (booking_id, reviewer_id) DO NOTHING`,
      [completedBookings[0].id, hostId, driverId]
    )
    console.log(`  ✅ Host ⭐⭐⭐⭐⭐ → Driver`)

    await pool.query(
      `INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment)
       VALUES ($1, $2, $3, 4, 'Good spot. Location is convenient.')
       ON CONFLICT (booking_id, reviewer_id) DO NOTHING`,
      [completedBookings[1].id, driverId, hostId]
    )
    console.log(`  ✅ Driver ⭐⭐⭐⭐ → Host`)

    console.log('\n✨ All demo data seeded successfully!\n')
    console.log('📋 Test Credentials:')
    console.log('  Driver:  driver@demo.com / password123')
    console.log('  Host:    host@demo.com / password123')
    console.log('  Admin:   admin@demo.com / password123\n')
    console.log('🪪 Test KYC for new signups:')
    console.log('  NID:           1234567890 (driver) | 9876543210 (host)')
    console.log('  License Plate: DHK-1234')
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    console.error(err)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

seed()
