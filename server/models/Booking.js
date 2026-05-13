const supabase = require('../config/supabase')

const Booking = {
  async findById(id) {
    const { data, error } = await supabase.from('v_bookings').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data
  },

  async create({ spotId, driverId, startTime, endTime, totalPrice }) {
    const { data, error } = await supabase.from('bookings').insert({
      spot_id:     spotId,
      driver_id:   driverId,
      start_time:  startTime,
      end_time:    endTime,
      total_price: totalPrice,
    }).select().single()
    if (error) throw error
    return data
  },

  async updateStatus(id, status, stripePaymentId = null) {
    const updateObj = { status }
    if (stripePaymentId) updateObj.stripe_payment_id = stripePaymentId
    const { data, error } = await supabase.from('bookings').update(updateObj).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async getByDriver(driverId) {
    const { data, error } = await supabase
      .from('v_bookings')
      .select('*')
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getByHost(hostId) {
    const { data, error } = await supabase
      .from('v_bookings')
      .select('*')
      .eq('host_id', hostId)
      .order('start_time', { ascending: false })
    if (error) throw error
    return data || []
  },

  async checkConflict(spotId, startTime, endTime, excludeBookingId = null) {
    const { data, error } = await supabase.rpc('check_booking_conflict', {
      p_spot_id:            parseInt(spotId),
      p_start_time:         startTime,
      p_end_time:           endTime,
      p_exclude_booking_id: excludeBookingId || null,
    })
    if (error) throw error
    return data === true
  },

  async delete(id) {
    const { error } = await supabase.from('bookings').delete().eq('id', id)
    if (error) throw error
  },

  async getAll({ limit = 100, offset = 0 } = {}) {
    const { data, error } = await supabase
      .from('v_bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    if (error) throw error
    return data || []
  },
}

module.exports = Booking
