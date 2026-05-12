import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'
import Button from '../../../components/UI/Button.jsx'

export default function HostEditProfile() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { data } = await axios.put(`${API}/users/${user.id}`, { name, phone })
      login(localStorage.getItem('token'), data)
      navigate('/host/profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <Link to="/host/profile" className="text-sm text-muted hover:text-ink mb-6 block">← Profile</Link>
      <div className="font-mono text-xs text-muted tracking-wider mb-2">EDIT PROFILE</div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Update your info.</h1>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="font-mono text-[11px] text-muted tracking-wider block mb-2">NAME</label>
          <input value={name} onChange={e => setName(e.target.value)} required
            className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20" />
        </div>
        <div>
          <label className="font-mono text-[11px] text-muted tracking-wider block mb-2">PHONE</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} type="tel"
            placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20" />
        </div>
        <div>
          <label className="font-mono text-[11px] text-muted tracking-wider block mb-2">EMAIL</label>
          <input value={user?.email} disabled
            className="w-full px-4 py-3 bg-paper2 border border-black/10 rounded-xl text-sm text-muted cursor-not-allowed" />
          <p className="text-xs text-muted mt-1">Email cannot be changed.</p>
        </div>
        <Button type="submit" disabled={saving} fullWidth>
          {saving ? 'Saving…' : 'Save changes →'}
        </Button>
      </form>
    </div>
  )
}
