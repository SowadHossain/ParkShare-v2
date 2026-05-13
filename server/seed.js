require('dotenv').config()
const bcrypt = require('bcrypt')
const supabase = require('./config/supabase')

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
      const { error } = await supabase
        .from('kyc_whitelist')
        .upsert(
          { type: entry.type, value: entry.value.toUpperCase(), note: entry.note },
          { onConflict: 'value', ignoreDuplicates: true }
        )
      if (error) console.warn(`  ⚠️  KYC upsert warning: ${error.message}`)
      else console.log(`  ✅ ${entry.type.toUpperCase()}: ${entry.value}`)
    }

    // Seed users
    console.log('\n📝 Seeding users...')
    const userMap = {}
    for (const user of DEMO_USERS) {
      const passwordHash = await bcrypt.hash(user.password, 10)

      const { data: existing } = await supabase
        .from('users')
        .select('id, email, role')
        .eq('email', user.email)
        .maybeSingle()

      if (existing) {
        await supabase.from('users').update({ password_hash: passwordHash }).eq('email', user.email)
        userMap[user.email] = existing.id
        console.log(`  ✅ ${user.role.toUpperCase()}: ${user.email} (updated)`)
      } else {
        const { data: created, error } = await supabase
          .from('users')
          .insert({
            name:          user.name,
            email:         user.email,
            password_hash: passwordHash,
            phone:         user.phone || null,
            bio:           user.bio   || null,
            role:          user.role,
            onboarded:     user.onboarded,
          })
          .select('id, email, role')
          .single()
        if (error) throw error
        userMap[user.email] = created.id
        console.log(`  ✅ ${user.role.toUpperCase()}: ${user.email}`)
      }
    }

    // Ensure all users are onboarded
    await supabase.from('users').update({ onboarded: true }).eq('onboarded', false)

    // Skip spots/bookings/reviews if demo data already exists
    const hostId = userMap['host@demo.com']
    const { data: existingSpots } = await supabase
      .from('spots')
      .select('id')
      .eq('host_id', hostId)
      .limit(1)

    if (existingSpots?.length > 0) {
      console.log('\n⏭️  Demo spots/bookings/reviews already exist — skipping.')
      console.log('\n✨ Seed complete (existing data preserved)\n')
      return
    }

    // Seed spots
    console.log('\n🅿️  Seeding spots...')
    const spotMap = {}
    for (const spot of DEMO_SPOTS) {
      const { data, error } = await supabase
        .from('spots')
        .insert({
          host_id:        userMap[spot.hostEmail],
          title:          spot.title,
          description:    spot.description,
          address:        spot.address,
          latitude:       spot.latitude,
          longitude:      spot.longitude,
          hourly_price:   spot.hourlyPrice,
          vehicle_size:   spot.vehicleSize,
          rules:          spot.rules,
          available_from: spot.availableFrom,
          available_to:   spot.availableTo,
          is_active:      true,
        })
        .select('id, title')
        .single()
      if (error) throw error
      spotMap[spot.title] = data.id
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

    const bookingDefs = [
      { spotId: spotMap['Spacious Driveway in Gulshan'], driverId, startTime: d(-2, 9),  endTime: d(-2, 14), totalPrice: 750,  status: 'completed' },
      { spotId: spotMap['Secure Parking - Banani'],      driverId, startTime: d(-1, 8),  endTime: d(-1, 10), totalPrice: 400,  status: 'completed' },
      { spotId: spotMap['Large Garage - Dhanmondi'],     driverId, startTime: d(1,  8),  endTime: d(1,  17), totalPrice: 2250, status: 'paid'      },
      { spotId: spotMap['Spacious Driveway in Gulshan'], driverId, startTime: d(2,  10), endTime: d(2,  12), totalPrice: 300,  status: 'pending'   },
    ]

    const bookingIds = []
    for (const b of bookingDefs) {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          spot_id:     b.spotId,
          driver_id:   b.driverId,
          start_time:  b.startTime,
          end_time:    b.endTime,
          total_price: b.totalPrice,
          status:      b.status,
        })
        .select('id')
        .single()
      if (error) throw error
      bookingIds.push({ id: data.id, ...b })
      console.log(`  ✅ Booking: ${b.status} - ৳${b.totalPrice}`)
    }

    // Seed transactions for paid/completed bookings
    console.log('\n💳 Seeding transactions...')
    for (const b of bookingIds) {
      if (b.status === 'paid' || b.status === 'completed') {
        const { error } = await supabase
          .from('transactions')
          .insert({ booking_id: b.id, amount: b.totalPrice, status: 'paid' })
        if (error) console.warn(`  ⚠️  Transaction warning: ${error.message}`)
        else console.log(`  ✅ Transaction: ৳${b.totalPrice}`)
      }
    }

    // Seed reviews (only for completed bookings)
    console.log('\n⭐ Seeding reviews...')
    const completedBookings = bookingIds.filter(b => b.status === 'completed')

    const reviews = [
      { booking_id: completedBookings[0].id, reviewer_id: driverId,  reviewee_id: hostId,   rating: 5, comment: 'Amazing spot! Secure and clean. Very responsive host.' },
      { booking_id: completedBookings[0].id, reviewer_id: hostId,    reviewee_id: driverId,  rating: 5, comment: 'Excellent driver! Very respectful, left the spot clean.' },
      { booking_id: completedBookings[1].id, reviewer_id: driverId,  reviewee_id: hostId,   rating: 4, comment: 'Good spot. Location is convenient.' },
    ]

    for (const rv of reviews) {
      const { error } = await supabase
        .from('reviews')
        .upsert(rv, { onConflict: 'booking_id,reviewer_id', ignoreDuplicates: true })
      if (error) console.warn(`  ⚠️  Review warning: ${error.message}`)
    }
    console.log('  ✅ Driver ⭐⭐⭐⭐⭐ → Host')
    console.log('  ✅ Host ⭐⭐⭐⭐⭐ → Driver')
    console.log('  ✅ Driver ⭐⭐⭐⭐ → Host')

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
  }
}

seed()
