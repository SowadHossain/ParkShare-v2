const supabase = require('../config/supabase')

const User = {
  async findById(id) {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data
  },

  async findByEmail(email) {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle()
    if (error) throw error
    return data
  },

  async findByGoogleId(googleId) {
    const { data, error } = await supabase.from('users').select('*').eq('google_id', googleId).maybeSingle()
    if (error) throw error
    return data
  },

  async create({ name, email, passwordHash, phone, role, nid, license_plate, kyc_status }) {
    const { data, error } = await supabase.from('users').insert({
      name,
      email,
      password_hash: passwordHash,
      phone: phone || null,
      role: role || 'driver',
      nid: nid || null,
      license_plate: license_plate || null,
      kyc_status: kyc_status || 'pending',
      onboarded: true,
    }).select().single()
    if (error) throw error
    return data
  },

  async update(id, fields) {
    const allowed = ['name', 'phone', 'bio', 'onboarded', 'avatar_url', 'vehicle_make', 'vehicle_model', 'vehicle_color', 'vehicle_size']
    const updateObj = {}
    for (const [key, val] of Object.entries(fields)) {
      if (allowed.includes(key)) updateObj[key] = val
    }
    if (!Object.keys(updateObj).length) return null
    const { data, error } = await supabase.from('users').update(updateObj).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase.from('users').delete().eq('id', id)
    if (error) throw error
  },

  async getAll({ role, search, limit = 50, offset = 0 } = {}) {
    let query = supabase
      .from('users')
      .select('id, name, email, phone, role, onboarded, created_at')
    if (role) query = query.eq('role', role)
    if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)
    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async markOnboarded(id) {
    const { data, error } = await supabase.from('users').update({ onboarded: true }).eq('id', id).select().single()
    if (error) throw error
    return data
  },
}

module.exports = User
