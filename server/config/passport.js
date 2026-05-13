const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const supabase = require('./supabase')

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email    = profile.emails[0].value
        const name     = profile.displayName
        const googleId = profile.id

        const { data: existing } = await supabase
          .from('users')
          .select('*')
          .eq('google_id', googleId)
          .maybeSingle()

        if (existing) {
          const { data: updated } = await supabase
            .from('users')
            .update({ name })
            .eq('google_id', googleId)
            .select()
            .single()
          return done(null, updated)
        }

        const { data: created, error } = await supabase
          .from('users')
          .insert({ name, email, google_id: googleId, role: 'driver', onboarded: false })
          .select()
          .single()
        if (error) return done(error)
        return done(null, created)
      } catch (err) {
        return done(err)
      }
    }
  )
)

module.exports = passport
