const pool = require('../config/db')

const Transaction = {
  async findById(id) {
    const { rows } = await pool.query(
      `SELECT t.*, b.spot_id, s.title AS spot_title, d.name AS driver_name
       FROM transactions t
       JOIN bookings b ON b.id = t.booking_id
       JOIN spots s ON s.id = b.spot_id
       JOIN users d ON d.id = b.driver_id
       WHERE t.id = $1`,
      [id]
    )
    return rows[0]
  },

  async create({ bookingId, amount, stripeId }) {
    const { rows } = await pool.query(
      `INSERT INTO transactions (booking_id, amount, stripe_id, status)
       VALUES ($1,$2,$3,'paid') RETURNING *`,
      [bookingId, amount, stripeId]
    )
    return rows[0]
  },

  async getByHost(hostId) {
    const { rows } = await pool.query(
      `SELECT t.*, s.title AS spot_title, d.name AS driver_name, b.start_time, b.end_time
       FROM transactions t
       JOIN bookings b ON b.id = t.booking_id
       JOIN spots s ON s.id = b.spot_id
       JOIN users d ON d.id = b.driver_id
       WHERE s.host_id = $1 ORDER BY t.created_at DESC`,
      [hostId]
    )
    return rows
  },

  async getByBooking(bookingId) {
    const { rows } = await pool.query(
      'SELECT * FROM transactions WHERE booking_id = $1',
      [bookingId]
    )
    return rows
  },

  async updateStatus(id, status) {
    const { rows } = await pool.query(
      'UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    )
    return rows[0]
  },
}

module.exports = Transaction
