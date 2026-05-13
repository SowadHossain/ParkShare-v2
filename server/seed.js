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
    hourlyPrice: 3.50,
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
    hourlyPrice: 4.00,
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
    hourlyPrice: 5.50,
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

    const bookings = [
      { spotId: spotMap['Spacious Driveway in Gulshan'], driverId, startTime: '2026-05-13 09:00:00', endTime: '2026-05-13 14:00:00', totalPrice: 17.50, status: 'completed' },
      { spotId: spotMap['Secure Parking - Banani'], driverId, startTime: '2026-05-13 15:00:00', endTime: '2026-05-13 18:00:00', totalPrice: 12.00, status: 'active' },
      { spotId: spotMap['Large Garage - Dhanmondi'], driverId, startTime: '2026-05-14 08:00:00', endTime: '2026-05-14 17:00:00', totalPrice: 49.50, status: 'paid' },
      { spotId: spotMap['Spacious Driveway in Gulshan'], driverId, startTime: '2026-05-15 10:00:00', endTime: '2026-05-15 12:00:00', totalPrice: 7.00, status: 'pending' },
      { spotId: spotMap['Secure Parking - Banani'], driverId, startTime: '2026-05-13 08:00:00', endTime: '2026-05-13 10:00:00', totalPrice: 8.00, status: 'completed' }
    ]

    const bookingMap = {}
    for (const booking of bookings) {
      const res = await pool.query(
        `INSERT INTO bookings (spot_id, driver_id, start_time, end_time, total_price, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [booking.spotId, booking.driverId, booking.startTime, booking.endTime, booking.totalPrice, booking.status]
      )
      bookingMap[res.rows[0].id] = booking
      console.log(`  ✅ Booking: ${booking.status} - $${booking.totalPrice}`)
    }

    // Seed transactions
    console.log('\n💳 Seeding transactions...')
    for (const [bookingId, booking] of Object.entries(bookingMap)) {
      if (booking.status === 'paid' || booking.status === 'completed') {
        await pool.query(
          `INSERT INTO transactions (booking_id, amount, status)
           VALUES ($1, $2, 'paid')`,
          [bookingId, booking.totalPrice]
        )
        console.log(`  ✅ Transaction: $${booking.totalPrice}`)
      }
    }

    // Seed reviews
    console.log('\n⭐ Seeding reviews...')
    const hostId = userMap['host@demo.com']

    // Driver reviews host
    await pool.query(
      `INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment)
       VALUES ($1, $2, $3, 5, 'Amazing spot! Secure and clean. Mrs. Khan is very responsive.')`,
      [Object.keys(bookingMap)[0], driverId, hostId]
    )
    console.log(`  ✅ Driver ⭐⭐⭐⭐⭐ → Host`)

    // Host reviews driver
    await pool.query(
      `INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment)
       VALUES ($1, $2, $3, 5, 'Excellent driver! Very respectful, left the spot clean.')`,
      [Object.keys(bookingMap)[0], hostId, driverId]
    )
    console.log(`  ✅ Host ⭐⭐⭐⭐⭐ → Driver`)

    // Driver reviews host again
    await pool.query(
      `INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment)
       VALUES ($1, $2, $3, 4, 'Good spot. Location is convenient.')`,
      [Object.keys(bookingMap)[4], driverId, hostId]
    )
    console.log(`  ✅ Driver ⭐⭐⭐⭐ → Host (Banani)`)

    console.log('\n✨ All demo data seeded successfully!\n')
    console.log('📋 Test Credentials:')
    console.log('  Driver:  driver@demo.com / password123')
    console.log('  Host:    host@demo.com / password123')
    console.log('  Admin:   admin@demo.com / password123\n')
    console.log('📊 Demo Data Summary:')
    console.log(`  KYC Entries: ${KYC_WHITELIST.length}`)
    console.log(`  Users:       ${Object.keys(userMap).length}`)
    console.log(`  Spots:       ${Object.keys(spotMap).length}`)
    console.log(`  Bookings:    ${Object.keys(bookingMap).length}`)
    console.log(`  Reviews:     3`)
    console.log('\n🪪 Test KYC Credentials for new signups:')
    console.log('  NID:           1234567890 (driver) | 9876543210 (host)')
    console.log('  License Plate: DHK-1234')

    process.exit(0)
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    console.error(err)
    process.exit(1)
  }
}

seed()
