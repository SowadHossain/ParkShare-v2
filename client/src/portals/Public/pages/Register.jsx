import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const defaultRole = params.get('role') || 'driver'

  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: defaultRole })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post(`${API}/auth/register`, form)
      login(res.data.token, res.data.user)
      navigate(`/${res.data.user.role}/welcome`)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-lime rounded-[10px] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 14V4h5.5a3 3 0 010 6H7" stroke="#0E0E0C" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-lg font-bold">ParkShare</span>
        </Link>

        <div className="font-mono text-xs text-muted tracking-widest mb-3">CREATE ACCOUNT</div>
        <h1 className="text-4xl font-bold tracking-tight mb-8">Join ParkShare.</h1>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}

        {/* Role toggle */}
        <div className="flex gap-1 bg-paper2 rounded-xl p-1 mb-6">
          {['driver', 'host'].map(r => (
            <button key={r} type="button" onClick={() => set('role', r)}
              className={`flex-1 py-2.5 rounded-[10px] text-sm font-semibold transition-all capitalize ${form.role === r ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'}`}>
              {r === 'driver' ? '🚗 I need parking' : '🏠 I have a driveway'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-mono text-[11px] text-muted tracking-wider">FULL NAME</label>
            <input type="text" required value={form.name || ''} onChange={e => set('name', e.target.value)}
              className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
              placeholder="Your full name" />
          </div>
          <div>
            <label className="font-mono text-[11px] text-muted tracking-wider">EMAIL</label>
            <input type="email" required value={form.email || ''} onChange={e => set('email', e.target.value)}
              className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
              placeholder="you@example.com" />
          </div>
          <div>
            <label className="font-mono text-[11px] text-muted tracking-wider">PHONE (optional)</label>
            <input type="tel" value={form.phone || ''} onChange={e => set('phone', e.target.value)}
              className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
              placeholder="+880 17..." />
          </div>
          <div>
            <label className="font-mono text-[11px] text-muted tracking-wider">PASSWORD</label>
            <input type="password" required minLength={6} value={form.password || ''} onChange={e => set('password', e.target.value)}
              className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
              placeholder="At least 6 characters" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-ink text-paper rounded-full font-semibold text-sm hover:bg-ink/90 disabled:opacity-50 transition-colors mt-2">
            {loading ? 'Creating account…' : 'Create account →'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-ink hover:underline">Sign in →</Link>
        </p>
      </div>
    </div>
  )
}
