import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'

export default function DriverEditProfile() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.put(`${API}/users/${user.id}`, form)
      setUser(u => ({ ...u, ...res.data }))
      navigate('/driver/profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <div className="font-mono text-xs text-muted tracking-wider mb-2">EDIT PROFILE</div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Update your info.</h1>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="font-mono text-[11px] text-muted tracking-wider">FULL NAME</label>
          <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20" />
        </div>
        <div>
          <label className="font-mono text-[11px] text-muted tracking-wider">PHONE</label>
          <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20" />
        </div>
        <div>
          <label className="font-mono text-[11px] text-muted tracking-wider">BIO</label>
          <textarea rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            className="mt-1.5 w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 resize-none" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-3.5 bg-ink text-paper rounded-full font-semibold hover:bg-ink/90 disabled:opacity-50 transition-colors mt-2">
          {loading ? 'Saving…' : 'Save changes →'}
        </button>
      </form>
    </div>
  )
}
