const pool = require('../config/db')

const Spot = {
  async findById(id) {
    const { rows } = await pool.query(
      `SELECT s.*, u.name AS host_name, u.phone AS host_phone,
              COALESCE(AVG(r.rating), 0) AS avg_rating,
              COUNT(r.id) AS review_count
       FROM spots s
       JOIN users u ON u.id = s.host_id
       LEFT JOIN bookings b ON b.spot_id = s.id
       LEFT JOIN reviews r ON r.booking_id = b.id
       WHERE s.id = $1
       GROUP BY s.id, u.name, u.phone`,
      [id]
    )
    return rows[0]
  },

  async create({ hostId, title, description, address, latitude, longitude, hourlyPrice, vehicleSize, rules, availableFrom, availableTo }) {
    const { rows } = await pool.query(
      `INSERT INTO spots (host_id, title, description, address, latitude, longitude, hourly_price, vehicle_size, rules, available_from, available_to)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [hostId, title, description, address, latitude, longitude, hourlyPrice, vehicleSize || 'sedan', rules, availableFrom || null, availableTo || null]
    )
    return rows[0]
  },

  async update(id, fields) {
    const allowed = ['title', 'description', 'address', 'latitude', 'longitude', 'hourly_price', 'vehicle_size', 'rules', 'available_from', 'available_to', 'is_active']
    const sets = []
    const vals = []
    let i = 1
    for (const [key, val] of Object.entries(fields)) {
      const col = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      if (allowed.includes(col)) {
        sets.push(`${col} = $${i++}`)
        vals.push(val)
      }
    }
    if (!sets.length) return null
    vals.push(id)
    const { rows } = await pool.query(
      `UPDATE spots SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
      vals
    )
    return rows[0]
  },

  async delete(id) {
    await pool.query('DELETE FROM spots WHERE id = $1', [id])
  },

  async getByHost(hostId) {
    const { rows } = await pool.query(
      `SELECT s.*, COALESCE(AVG(r.rating),0) AS avg_rating, COUNT(DISTINCT b.id) AS booking_count
       FROM spots s
       LEFT JOIN bookings b ON b.spot_id = s.id
       LEFT JOIN reviews r ON r.booking_id = b.id
       WHERE s.host_id = $1
       GROUP BY s.id ORDER BY s.created_at DESC`,
      [hostId]
    )
    return rows
  },

  async search({ lat, lng, maxPrice, minRating, vehicleSize, startTime, endTime, radius = 5 } = {}) {
    let q = `
      SELECT s.*, u.name AS host_name,
             COALESCE(AVG(r.rating),0) AS avg_rating,
             COUNT(r.id) AS review_count
      FROM spots s
      JOIN users u ON u.id = s.host_id
      LEFT JOIN bookings b ON b.spot_id = s.id
      LEFT JOIN reviews r ON r.booking_id = b.id
      WHERE s.is_active = true`
    const vals = []
    let i = 1

    if (lat && lng) {
      const latDelta = radius / 111.0
      const lngDelta = radius / (111.0 * Math.cos((lat * Math.PI) / 180))
      q += ` AND s.latitude BETWEEN $${i} AND $${i + 1} AND s.longitude BETWEEN $${i + 2} AND $${i + 3}`
      vals.push(lat - latDelta, lat + latDelta, lng - lngDelta, lng + lngDelta)
      i += 4
    }
    if (maxPrice) { q += ` AND s.hourly_price <= $${i++}`; vals.push(maxPrice) }
    if (vehicleSize) { q += ` AND s.vehicle_size = $${i++}`; vals.push(vehicleSize) }

    // Exclude spots that have a confirmed booking overlapping the requested window
    if (startTime && endTime) {
      q += ` AND s.id NOT IN (
        SELECT spot_id FROM bookings
        WHERE status IN ('paid', 'active')
          AND start_time < $${i + 1} AND end_time > $${i}
      )`
      vals.push(startTime, endTime)
      i += 2
    }

    q += ` GROUP BY s.id, u.name`
    if (minRating) { q += ` HAVING COALESCE(AVG(r.rating),0) >= $${i++}`; vals.push(minRating) }
    q += ' ORDER BY avg_rating DESC, s.hourly_price ASC LIMIT 100'

    const { rows } = await pool.query(q, vals)
    return rows
  },

  async getAll({ limit = 50, offset = 0 } = {}) {
    const { rows } = await pool.query(
      `SELECT s.*, u.name AS host_name, COALESCE(AVG(r.rating),0) AS avg_rating
       FROM spots s JOIN users u ON u.id = s.host_id
       LEFT JOIN bookings b ON b.spot_id = s.id
       LEFT JOIN reviews r ON r.booking_id = b.id
       GROUP BY s.id, u.name
       ORDER BY s.created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    )
    return rows
  },
}

module.exports = Spot
