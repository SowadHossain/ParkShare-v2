import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Loader from '../../components/UI/Loader.jsx'

const NAV = [
  { to: '/driver/search',        label: 'Search'   },
  { to: '/driver/bookings',      label: 'Trips'    },
  { to: '/driver/notifications', label: 'Alerts'   },
  { to: '/driver/profile',       label: 'Profile'  },
]

function DesktopNav({ user, logout }) {
  return (
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-paper border-b border-black/10 sticky top-0 z-30">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-ink rounded-lg flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
            <path d="M4 14V4h5.5a3 3 0 010 6H7" stroke="#C8FF3D" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </div>
        <span className="font-bold text-sm">ParkShare</span>
      </div>
      <nav className="flex items-center gap-1">
        {NAV.map(({ to, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                isActive ? 'bg-ink text-paper' : 'text-muted hover:text-ink hover:bg-paper2'
              }`
            }>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <div className="text-sm text-muted">{user?.name?.split(' ')[0]}</div>
      </div>
    </header>
  )
}

export default function DriverLayout() {
  const { user, loading } = useAuth()
  const { key } = useLocation()

  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'driver') return <Navigate to={`/${user.role}/dashboard`} replace />

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <DesktopNav user={user} />

      {/* Content — extra bottom padding on mobile for floating nav */}
      <main className="flex-1 md:pb-0 pb-28">
        <div key={key} className="page-transition min-h-full">
          <Outlet />
        </div>
      </main>

      {/* Floating pill nav — mobile only */}
      <nav className="md:hidden pill-nav">
        {NAV.map(({ to, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => `pill-nav-item${isActive ? ' active' : ''}`}>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
