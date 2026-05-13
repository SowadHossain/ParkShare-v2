const supabase = require('../config/supabase')

const Transaction = {
  async findById(id) {
    const { data, error } = await supabase.from('v_transactions').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data
  },

  async create({ bookingId, amount, stripeId }) {
    const { data, error } = await supabase.from('transactions').insert({
      booking_id: bookingId,
      amount,
      stripe_id: stripeId,
      status: 'paid',
    }).select().single()
    if (error) throw error
    return data
  },

  async getByHost(hostId) {
    const { data, error } = await supabase
      .from('v_transactions')
      .select('*')
      .eq('host_id', hostId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getByStripeId(stripeId) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('stripe_id', stripeId)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async getByBooking(bookingId) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('booking_id', bookingId)
    if (error) throw error
    return data || []
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
}

module.exports = Transaction
