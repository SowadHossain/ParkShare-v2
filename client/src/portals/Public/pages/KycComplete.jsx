import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth, API } from '../../../context/AuthContext.jsx'

export default function KycComplete() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ role: 'driver', nid: '', license_plate: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await axios.post(`${API}/auth/complete-kyc`, {
        nid: form.nid,
        license_plate: form.role === 'driver' ? form.license_plate : undefined,
        role: form.role,
      })
      setUser(data.user)
      navigate(`/${data.user.role}/welcome`)
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-md">
        <div className="font-mono text-xs text-muted tracking-widest mb-3">ONE MORE STEP</div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Verify your identity.</h1>
        <p className="text-sm text-muted mb-8 leading-relaxed">
          {user?.name ? `Hi ${user.name.split(' ')[0]} — ` : ''}Google sign-in requires a quick KYC check before you can use ParkShare.
        </p>

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
            <label className="font-mono text-[11px] text-muted tracking-wider">NATIONAL ID (NID)</label>
            <input type="text" required value={form.nid} onChange={e => set('nid', e.target.value)}
              className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
              placeholder="e.g. 1234567890" />
          </div>

          {form.role === 'driver' && (
            <div>
              <label className="font-mono text-[11px] text-muted tracking-wider">LICENSE PLATE</label>
              <input type="text" required value={form.license_plate} onChange={e => set('license_plate', e.target.value.toUpperCase())}
                className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 font-mono tracking-widest"
                placeholder="e.g. DHK-1234" />
            </div>
          )}

          <p className="text-[11px] text-muted leading-relaxed">
            Your NID and license plate are verified against our approved database. Contact support if you have issues.
          </p>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-ink text-paper rounded-full font-semibold text-sm hover:bg-ink/90 disabled:opacity-50 transition-colors mt-2">
            {loading ? 'Verifying…' : 'Complete sign-up →'}
          </button>
        </form>
      </div>
    </div>
  )
}
