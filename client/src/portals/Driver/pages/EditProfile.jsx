import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'
import AvatarUpload from '../../../components/UI/AvatarUpload.jsx'

export default function DriverEditProfile() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleAvatarUploaded(url) {
    setUser(u => ({ ...u, avatar_url: url }))
  }

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
    <div className="max-w-md mx-auto px-5 py-8">
      <Link to="/driver/profile" className="text-sm text-muted hover:text-ink mb-6 block">← Profile</Link>
      <div className="font-mono text-xs text-muted tracking-wider mb-2">EDIT PROFILE</div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Update your info.</h1>

      <div className="mb-8">
        <label className="font-mono text-[11px] text-muted tracking-wider block mb-3">PHOTO</label>
        <AvatarUpload user={user} onUploaded={handleAvatarUploaded} />
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {[
          ['FULL NAME', 'text', 'name', true],
          ['PHONE', 'tel', 'phone', false],
        ].map(([label, type, field, required]) => (
          <div key={field}>
            <label className="font-mono text-[11px] text-muted tracking-wider">{label}</label>
            <input type={type} required={required} value={form[field]}
              onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
              className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20" />
          </div>
        ))}
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
