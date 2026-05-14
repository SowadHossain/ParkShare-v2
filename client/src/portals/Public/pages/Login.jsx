import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post(`${API}/auth/login`, form)
      login(res.data.token, res.data.user)
      const role = res.data.user.role
      if (!res.data.user.onboarded) {
        navigate(`/${role}/welcome`)
      } else {
        navigate(`/${role}/dashboard`)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const demoAccounts = [
    { email: 'driver@demo.com', password: 'password123', role: 'Driver' },
    { email: 'host@demo.com', password: 'password123', role: 'Host' },
    { email: 'admin@demo.com', password: 'password123', role: 'Admin' }
  ]

  const [showDemo, setShowDemo] = useState(false)

  return (
    <div className="min-h-screen flex bg-paper">
      {/* Left: form */}
      <div className="flex-1 flex flex-col p-10 md:p-14">
        <div className="my-auto max-w-sm w-full">
          <div className="font-mono text-xs text-muted tracking-widest mb-3">WELCOME BACK</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-none mb-8">Welcome<br />back.</h1>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-mono text-[11px] text-muted tracking-wider">EMAIL</label>
              <input
                type="email" required
                value={form.email || ''}
                onChange={e => set('email', e.target.value)}
                className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label className="font-mono text-[11px] text-muted tracking-wider">PASSWORD</label>
                <Link to="/forgot-password" className="text-xs font-semibold hover:text-ink transition-colors">Forgot?</Link>
              </div>
              <div className="relative mt-1.5">
                <input
                  type={show ? 'text' : 'password'} required
                  value={form.password || ''}
                  onChange={e => set('password', e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 pr-16"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-muted tracking-wider">
                  {show ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-13 py-3.5 bg-ink text-paper rounded-full font-semibold text-sm hover:bg-ink/90 disabled:opacity-50 transition-colors mt-2">
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-black/10" />
            <span className="font-mono text-[11px] text-muted">OR</span>
            <div className="flex-1 h-px bg-black/10" />
          </div>

          <a href={`${API_URL.replace('/api', '')}/api/auth/google`}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-black/10 rounded-full text-sm font-semibold hover:bg-paper2 transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.6 9.2c0-.7-.06-1.4-.18-2H9v3.8h4.84a4.14 4.14 0 01-1.8 2.7v2.25h2.92c1.7-1.57 2.7-3.9 2.7-6.75z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.55-1.84.87-3.04.87-2.34 0-4.32-1.58-5.02-3.7H.95v2.32A9 9 0 009 18z" fill="#34A853" />
              <path d="M3.98 10.73a5.41 5.41 0 010-3.46V4.96H.95a9 9 0 000 8.08l3.03-2.31z" fill="#FBBC05" />
              <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 00.95 4.96l3.03 2.3C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335" />
            </svg>
            Continue with Google
          </a>

          <p className="text-center mt-6 text-sm text-muted">
            New to ParkShare?{' '}
            <Link to="/register" className="font-semibold text-ink hover:underline">Create account →</Link>
          </p>
        </div>
        <div className="font-mono text-[11px] text-muted tracking-wider">© 2026 · CSE482</div>
      </div>

      {/* Demo Credentials Floating Helper */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="w-12 h-12 rounded-full bg-lime text-ink flex items-center justify-center font-bold text-lg shadow-lg hover:bg-lime/90 transition-colors"
          title="Test Credentials"
        >
          ?
        </button>

        {showDemo && (
          <div className="absolute bottom-16 right-0 w-72 bg-white rounded-2xl shadow-2xl border border-black/10 p-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between mb-3">
              <div className="font-mono text-xs font-bold text-ink tracking-wider">TEST ACCOUNTS</div>
              <button
                onClick={() => setShowDemo(false)}
                className="text-lg text-muted hover:text-ink transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-2">
              {demoAccounts.map(acc => (
                <div
                  key={acc.email}
                  className="p-3 bg-paper2 rounded-xl border border-black/5 hover:border-lime/30 cursor-pointer transition-all hover:bg-paper2/70"
                  onClick={() => {
                    setForm({ email: acc.email, password: acc.password })
                    setShowDemo(false)
                  }}
                >
                  <div className="font-mono text-[11px] text-muted tracking-wider mb-1">{acc.role.toUpperCase()}</div>
                  <div className="text-xs text-ink font-semibold truncate">{acc.email}</div>
                  <div className="text-xs text-muted font-mono mt-1">{acc.password}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-black/5">
              <div className="font-mono text-[10px] text-muted leading-relaxed">Click an account to auto-fill the form.</div>
            </div>
          </div>
        )}
      </div>

      {/* Right: testimonial panel */}
      <div className="hidden md:flex flex-1 bg-ink text-paper p-14 flex-col relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 70% 30%, rgba(200,255,61,0.18), transparent 60%)' }} />
        <div className="relative">
          <div className="font-mono text-xs text-lime tracking-widest mb-3">● TODAY IN GULSHAN</div>
          <h2 className="text-4xl font-bold leading-tight tracking-tight">14 fresh spots<br />under ৳400/hr.</h2>
        </div>
        <div className="relative mt-auto p-5 bg-white/6 rounded-2xl border border-white/8">
          <p className="text-sm text-paper/70 leading-relaxed italic">
            "I parked at Mrs. Khan's driveway every Tuesday for my yoga class. She brought me chai once. Five stars."
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-paper2/20 flex items-center justify-center text-sm font-bold text-paper">NS</div>
            <div>
              <div className="text-sm font-semibold">Nadia Sultana</div>
              <div className="text-xs text-paper/50 mt-0.5">Driver since Feb 2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
