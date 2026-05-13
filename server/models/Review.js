const supabase = require('../config/supabase')

const Review = {
  async findById(id) {
    const { data, error } = await supabase.from('v_reviews').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data
  },

  async create({ bookingId, reviewerId, revieweeId, rating, comment }) {
    const { data, error } = await supabase.from('reviews').insert({
      booking_id:  bookingId,
      reviewer_id: reviewerId,
      reviewee_id: revieweeId,
      rating,
      comment,
    }).select().single()
    if (error) throw error
    return data
  },

  async getByUser(userId) {
    const { data, error } = await supabase
      .from('v_reviews')
      .select('*')
      .eq('reviewee_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getBySpot(spotId) {
    const { data, error } = await supabase
      .from('v_reviews')
      .select('*')
      .eq('spot_id', spotId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async delete(id) {
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) throw error
  },

  async getAll({ limit = 100, offset = 0 } = {}) {
    const { data, error } = await supabase
      .from('v_reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    if (error) throw error
    return data || []
  },

  async existsForBooking(bookingId, reviewerId) {
    const { data, error } = await supabase
      .from('reviews')
      .select('id')
      .eq('booking_id', bookingId)
      .eq('reviewer_id', reviewerId)
      .maybeSingle()
    if (error) throw error
    return data !== null
  },
}

module.exports = Review
