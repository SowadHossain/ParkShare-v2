require('dotenv').config()
const bcrypt = require('bcrypt')
const pool = require('./config/db')

const DEMO_USERS = [
  {
    name: 'Rafiq Ahmed',
    email: 'driver@demo.com',
    password: 'password123',
    role: 'driver',
    onboarded: true
  },
  {
    name: 'Mrs. Khan',
    email: 'host@demo.com',
    password: 'password123',
    role: 'host',
    onboarded: true
  },
  {
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'password123',
    role: 'admin',
    onboarded: true
  }
]

async function seed() {
  try {
    console.log('🌱 Seeding demo users...')

    for (const user of DEMO_USERS) {
      const passwordHash = await bcrypt.hash(user.password, 10)

      await pool.query(
        `INSERT INTO users (name, email, password_hash, role, onboarded)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
         RETURNING id, email, role`,
        [user.name, user.email, passwordHash, user.role, user.onboarded]
      )

      console.log(`✅ ${user.role.toUpperCase()}: ${user.email} / ${user.password}`)
    }

    console.log('\n✨ Demo users seeded successfully!')
    console.log('\nTest credentials:')
    console.log('  Driver: driver@demo.com / password123')
    console.log('  Host:   host@demo.com / password123')
    console.log('  Admin:  admin@demo.com / password123')

    process.exit(0)
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
  }
}

seed()
