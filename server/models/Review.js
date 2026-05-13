const pool = require('../config/db')

const Review = {
  async findById(id) {
    const { rows } = await pool.query(
      `SELECT r.*, u.name AS reviewer_name FROM reviews r JOIN users u ON u.id = r.reviewer_id WHERE r.id = $1`,
      [id]
    )
    return rows[0]
  },

  async create({ bookingId, reviewerId, revieweeId, rating, comment }) {
    const { rows } = await pool.query(
      `INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [bookingId, reviewerId, revieweeId, rating, comment]
    )
    return rows[0]
  },

  async getByUser(userId) {
    const { rows } = await pool.query(
      `SELECT r.*, u.name AS reviewer_name FROM reviews r
       JOIN users u ON u.id = r.reviewer_id
       WHERE r.reviewee_id = $1 ORDER BY r.created_at DESC`,
      [userId]
    )
    return rows
  },

  async getBySpot(spotId) {
    const { rows } = await pool.query(
      `SELECT r.*, u.name AS reviewer_name
       FROM reviews r
       JOIN bookings b ON b.id = r.booking_id
       JOIN users u ON u.id = r.reviewer_id
       WHERE b.spot_id = $1 ORDER BY r.created_at DESC`,
      [spotId]
    )
    return rows
  },

  async delete(id) {
    await pool.query('DELETE FROM reviews WHERE id = $1', [id])
  },

  async getAll({ limit = 100, offset = 0 } = {}) {
    const { rows } = await pool.query(
      `SELECT r.*,
              u.name  AS reviewer_name,
              rv.name AS reviewee_name,
              s.title AS spot_title
       FROM reviews r
       JOIN users u    ON u.id  = r.reviewer_id
       JOIN users rv   ON rv.id = r.reviewee_id
       JOIN bookings b ON b.id  = r.booking_id
       JOIN spots s    ON s.id  = b.spot_id
       ORDER BY r.created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    )
    return rows
  },

  async existsForBooking(bookingId, reviewerId) {
    const { rows } = await pool.query(
      'SELECT id FROM reviews WHERE booking_id = $1 AND reviewer_id = $2',
      [bookingId, reviewerId]
    )
    return rows.length > 0
  },
}

module.exports = Review
