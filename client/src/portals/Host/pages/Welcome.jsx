import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'
import axios from 'axios'

export default function HostWelcome() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  async function handleStart() {
    try {
      await axios.post(`${API}/auth/onboarded`)
      setUser(u => ({ ...u, onboarded: true }))
    } catch {}
    navigate('/host/spots/new/location')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 bg-lime rounded-3xl flex items-center justify-center mx-auto mb-8">
          <span className="text-3xl">🏠</span>
        </div>
        <div className="font-mono text-xs text-muted tracking-widest mb-3">WELCOME, HOST</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Hey {user?.name?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="text-muted text-base leading-relaxed mb-8">
          You're set up as a host. List your driveway in under 5 minutes and start earning passive income from drivers in your area.
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={handleStart}
            className="w-full py-4 bg-lime text-ink rounded-full font-semibold text-base hover:opacity-90 transition-opacity">
            List my driveway →
          </button>
          <button onClick={() => navigate('/host/dashboard')}
            className="w-full py-4 bg-paper2 text-muted rounded-full font-semibold text-sm hover:bg-paper2/70 transition-colors">
            Go to dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
