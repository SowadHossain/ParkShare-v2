const pool = require('../config/db')

const Booking = {
  async findById(id) {
    const { rows } = await pool.query(
      `SELECT b.*,
              s.title AS spot_title, s.address AS spot_address, s.latitude, s.longitude, s.hourly_price,
              d.name AS driver_name, d.email AS driver_email, d.phone AS driver_phone,
              h.name AS host_name, h.email AS host_email, h.phone AS host_phone,
              h.id AS host_id
       FROM bookings b
       JOIN spots s ON s.id = b.spot_id
       JOIN users d ON d.id = b.driver_id
       JOIN users h ON h.id = s.host_id
       WHERE b.id = $1`,
      [id]
    )
    return rows[0]
  },

  async create({ spotId, driverId, startTime, endTime, totalPrice }) {
    const { rows } = await pool.query(
      `INSERT INTO bookings (spot_id, driver_id, start_time, end_time, total_price)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [spotId, driverId, startTime, endTime, totalPrice]
    )
    return rows[0]
  },

  async updateStatus(id, status, stripePaymentId = null) {
    const { rows } = await pool.query(
      `UPDATE bookings SET status = $1, stripe_payment_id = COALESCE($2, stripe_payment_id)
       WHERE id = $3 RETURNING *`,
      [status, stripePaymentId, id]
    )
    return rows[0]
  },

  async getByDriver(driverId) {
    const { rows } = await pool.query(
      `SELECT b.*, s.title AS spot_title, s.address AS spot_address
       FROM bookings b JOIN spots s ON s.id = b.spot_id
       WHERE b.driver_id = $1 ORDER BY b.created_at DESC`,
      [driverId]
    )
    return rows
  },

  async getByHost(hostId) {
    const { rows } = await pool.query(
      `SELECT b.*, s.title AS spot_title, d.name AS driver_name, d.phone AS driver_phone
       FROM bookings b
       JOIN spots s ON s.id = b.spot_id
       JOIN users d ON d.id = b.driver_id
       WHERE s.host_id = $1 ORDER BY b.start_time DESC`,
      [hostId]
    )
    return rows
  },

  async checkConflict(spotId, startTime, endTime, excludeBookingId = null) {
    let q = `SELECT id FROM bookings
             WHERE spot_id = $1
               AND status NOT IN ('cancelled')
               AND start_time < $3
               AND end_time > $2`
    const vals = [spotId, startTime, endTime]
    if (excludeBookingId) { q += ` AND id != $4`; vals.push(excludeBookingId) }
    const { rows } = await pool.query(q, vals)
    return rows.length > 0
  },

  async delete(id) {
    await pool.query('DELETE FROM bookings WHERE id = $1', [id])
  },

  async getAll({ limit = 100, offset = 0 } = {}) {
    const { rows } = await pool.query(
      `SELECT b.*, s.title AS spot_title, d.name AS driver_name
       FROM bookings b JOIN spots s ON s.id = b.spot_id JOIN users d ON d.id = b.driver_id
       ORDER BY b.created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    )
    return rows
  },
}

module.exports = Booking
