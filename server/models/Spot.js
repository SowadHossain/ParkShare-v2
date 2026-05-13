const supabase = require('../config/supabase')

const Spot = {
  async findById(id) {
    const { data, error } = await supabase.from('v_spots').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data
  },

  async create({ hostId, title, description, address, latitude, longitude, hourlyPrice, vehicleSize, rules, availableFrom, availableTo }) {
    const { data, error } = await supabase.from('spots').insert({
      host_id: hostId,
      title,
      description,
      address,
      latitude,
      longitude,
      hourly_price: hourlyPrice,
      vehicle_size: vehicleSize || 'sedan',
      rules,
      available_from: availableFrom || null,
      available_to: availableTo || null,
    }).select().single()
    if (error) throw error
    return data
  },

  async update(id, fields) {
    const allowed = ['title', 'description', 'address', 'latitude', 'longitude', 'hourly_price', 'vehicle_size', 'rules', 'available_from', 'available_to', 'is_active']
    const updateObj = {}
    for (const [key, val] of Object.entries(fields)) {
      const col = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      if (allowed.includes(col)) updateObj[col] = val
    }
    if (!Object.keys(updateObj).length) return null
    const { data, error } = await supabase.from('spots').update(updateObj).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase.from('spots').delete().eq('id', id)
    if (error) throw error
  },

  async getByHost(hostId) {
    const { data, error } = await supabase
      .from('v_spots')
      .select('*')
      .eq('host_id', hostId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async search({ lat, lng, maxPrice, minRating, vehicleSize, startTime, endTime, radius = 5 } = {}) {
    const { data, error } = await supabase.rpc('search_spots', {
      p_lat:          lat          || null,
      p_lng:          lng          || null,
      p_max_price:    maxPrice     || null,
      p_min_rating:   minRating    || null,
      p_vehicle_size: vehicleSize  || null,
      p_start_time:   startTime    || null,
      p_end_time:     endTime      || null,
      p_radius:       radius,
    })
    if (error) throw error
    return data || []
  },

  async getAll({ limit = 50, offset = 0 } = {}) {
    const { data, error } = await supabase
      .from('v_spots')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    if (error) throw error
    return data || []
  },
}

module.exports = Spot
