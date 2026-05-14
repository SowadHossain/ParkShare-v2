import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const defaultRole = params.get('role') || 'driver'

  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: defaultRole, nid: '', license_plate: '' })
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
      navigate('/kyc-pending')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-md">
        <div className="font-mono text-xs text-muted tracking-widest mb-3">CREATE ACCOUNT</div>
        <h1 className="text-4xl font-bold tracking-tight mb-8">Create an account.</h1>

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

          {/* KYC fields */}
          <div className="pt-2 pb-1">
            <div className="font-mono text-[11px] text-muted tracking-wider mb-3 flex items-center gap-2">
              <span className="flex-1 h-px bg-black/10" />
              KYC VERIFICATION
              <span className="flex-1 h-px bg-black/10" />
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-mono text-[11px] text-muted tracking-wider">NATIONAL ID (NID)</label>
                <input type="text" required value={form.nid || ''} onChange={e => set('nid', e.target.value)}
                  className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
                  placeholder="e.g. 1234567890" />
              </div>
              {(form.role === 'driver' || !form.role) && (
                <div>
                  <label className="font-mono text-[11px] text-muted tracking-wider">LICENSE PLATE</label>
                  <input type="text" required value={form.license_plate || ''} onChange={e => set('license_plate', e.target.value.toUpperCase())}
                    className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 font-mono tracking-widest"
                    placeholder="e.g. DHK-1234" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-muted mt-3 leading-relaxed">
              Your details will be reviewed by our team. You'll be notified once your KYC is approved.
            </p>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-ink text-paper rounded-full font-semibold text-sm hover:bg-ink/90 disabled:opacity-50 transition-colors mt-2">
            {loading ? 'Verifying & creating account…' : 'Create account →'}
          </button>
        </form>

        <div className="flex items-center gap-3 mt-5">
          <div className="flex-1 h-px bg-black/10" />
          <span className="font-mono text-[11px] text-muted">OR</span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        <a href={`${API_URL.replace('/api', '')}/api/auth/google`}
          className="mt-4 w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-black/10 rounded-full text-sm font-semibold hover:bg-paper2 transition-colors">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.6 9.2c0-.7-.06-1.4-.18-2H9v3.8h4.84a4.14 4.14 0 01-1.8 2.7v2.25h2.92c1.7-1.57 2.7-3.9 2.7-6.75z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.55-1.84.87-3.04.87-2.34 0-4.32-1.58-5.02-3.7H.95v2.32A9 9 0 009 18z" fill="#34A853" />
            <path d="M3.98 10.73a5.41 5.41 0 010-3.46V4.96H.95a9 9 0 000 8.08l3.03-2.31z" fill="#FBBC05" />
            <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 00.95 4.96l3.03 2.3C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335" />
          </svg>
          Continue with Google
        </a>

        <p className="text-center mt-5 text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-ink hover:underline">Sign in →</Link>
        </p>
      </div>
    </div>
  )
}
