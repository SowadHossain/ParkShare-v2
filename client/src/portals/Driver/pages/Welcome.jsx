import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'
import axios from 'axios'

export default function DriverWelcome() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  async function handleStart() {
    try {
      await axios.post(`${API}/auth/onboarded`)
      setUser(u => ({ ...u, onboarded: true }))
    } catch {}
    navigate('/driver/search')
  }

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 bg-lime rounded-3xl flex items-center justify-center mx-auto mb-8">
          <svg width="40" height="40" viewBox="0 0 18 18" fill="none">
            <path d="M4 14V4h5.5a3 3 0 010 6H7" stroke="#0E0E0C" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </div>
        <div className="font-mono text-xs text-muted tracking-widest mb-3">WELCOME TO PARKSHARE</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Hey {user?.name?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="text-muted text-base leading-relaxed mb-8">
          You're set up as a driver. Find driveways near you, book in seconds, and only pay for the time you use. No subscriptions. No surprises.
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={handleStart}
            className="w-full py-4 bg-ink text-paper rounded-full font-semibold text-base hover:bg-ink/90 transition-colors">
            Find parking now →
          </button>
          <button onClick={() => navigate('/driver/dashboard')}
            className="w-full py-4 bg-paper2 text-muted rounded-full font-semibold text-sm hover:bg-paper2/70 transition-colors">
            Go to dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
