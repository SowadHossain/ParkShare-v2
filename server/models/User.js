const pool = require('../config/db')

const User = {
  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    return rows[0]
  },

  async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    return rows[0]
  },

  async findByGoogleId(googleId) {
    const { rows } = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId])
    return rows[0]
  },

  async create({ name, email, passwordHash, phone, role, nid, license_plate, kyc_status }) {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone, role, nid, license_plate, kyc_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, email, passwordHash, phone || null, role || 'driver', nid || null, license_plate || null, kyc_status || 'pending']
    )
    return rows[0]
  },

  async update(id, fields) {
    const allowed = ['name', 'phone', 'bio', 'onboarded', 'avatar_url', 'vehicle_make', 'vehicle_model', 'vehicle_color', 'vehicle_size']
    const sets = []
    const vals = []
    let i = 1
    for (const [key, val] of Object.entries(fields)) {
      if (allowed.includes(key)) {
        sets.push(`${key} = $${i++}`)
        vals.push(val)
      }
    }
    if (!sets.length) return null
    vals.push(id)
    const { rows } = await pool.query(
      `UPDATE users SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
      vals
    )
    return rows[0]
  },

  async delete(id) {
    await pool.query('DELETE FROM users WHERE id = $1', [id])
  },

  async getAll({ role, search, limit = 50, offset = 0 } = {}) {
    let q = 'SELECT id, name, email, phone, role, onboarded, created_at FROM users WHERE 1=1'
    const vals = []
    let i = 1
    if (role) { q += ` AND role = $${i++}`; vals.push(role) }
    if (search) { q += ` AND (name ILIKE $${i} OR email ILIKE $${i})`; vals.push(`%${search}%`); i++ }
    q += ` ORDER BY created_at DESC LIMIT $${i++} OFFSET $${i++}`
    vals.push(limit, offset)
    const { rows } = await pool.query(q, vals)
    return rows
  },

  async markOnboarded(id) {
    const { rows } = await pool.query(
      'UPDATE users SET onboarded = true WHERE id = $1 RETURNING *',
      [id]
    )
    return rows[0]
  },
}

module.exports = User
