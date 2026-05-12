import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Loader from '../../components/UI/Loader.jsx'

function HostSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const links = [
    { to: '/host/dashboard', label: 'Dashboard', ic: '▭' },
    { to: '/host/spots', label: 'My spots', ic: '▤' },
    { to: '/host/bookings', label: 'Bookings', ic: '◷' },
    { to: '/host/earnings', label: 'Earnings', ic: '$' },
    { to: '/host/notifications', label: 'Notifications', ic: '♥' },
    { to: '/host/profile', label: 'Profile', ic: '◉' },
  ]

  return (
    <aside className="w-56 flex-shrink-0 bg-ink text-paper flex flex-col min-h-screen">
      <div className="px-5 py-6 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-lime rounded-[9px] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 14V4h5.5a3 3 0 010 6H7" stroke="#0E0E0C" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-sm font-bold">ParkShare <span className="text-lime font-mono text-[10px] ml-1">HOST</span></div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map(l => (
          <NavLink key={l.to} to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-white/8 text-paper' : 'text-paper/60 hover:text-paper/90'}`
            }>
            <span className="font-mono text-xs w-4 text-center opacity-70">{l.ic}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 pb-5">
        <button onClick={() => { logout(); navigate('/') }}
          className="w-full py-2.5 text-xs text-paper/50 hover:text-paper/80 transition-colors font-medium">
          Sign out
        </button>
      </div>
    </aside>
  )
}

export default function HostLayout() {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'host') return <Navigate to={`/${user.role}/dashboard`} replace />
  return (
    <div className="flex min-h-screen bg-paper">
      <HostSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
