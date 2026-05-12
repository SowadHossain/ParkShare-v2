const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const pool = require('./db')

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value
        const name = profile.displayName
        const googleId = profile.id

        // upsert user
        const { rows } = await pool.query(
          `INSERT INTO users (name, email, google_id, role, onboarded)
           VALUES ($1, $2, $3, 'driver', false)
           ON CONFLICT (google_id) DO UPDATE SET name = EXCLUDED.name
           RETURNING *`,
          [name, email, googleId]
        )
        return done(null, rows[0])
      } catch (err) {
        return done(err)
      }
    }
  )
)

module.exports = passport
