import { useState } from 'react'
import { Outlet, Navigate, NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Loader from '../../components/UI/Loader.jsx'

const MOBILE_NAV = [
  { to: '/driver/dashboard',     label: 'Home',    end: true },
  { to: '/driver/search',        label: 'Search'            },
  { to: '/driver/bookings',      label: 'Trips'             },
  { to: '/driver/notifications', label: 'Alerts'            },
]

const DESKTOP_NAV = [
  { to: '/driver/dashboard',     label: 'Home',    end: true },
  { to: '/driver/search',        label: 'Search'            },
  { to: '/driver/bookings',      label: 'Trips'             },
  { to: '/driver/notifications', label: 'Alerts'            },
  { to: '/driver/profile',       label: 'Profile'           },
]

const DRAWER_LINKS = [
  { to: '/driver/profile',      label: 'Profile',      icon: '👤' },
  { to: '/driver/profile/edit', label: 'Edit Profile', icon: '✏️' },
  { to: '/driver/settings',     label: 'Settings',     icon: '⚙️' },
]

function MobileMenuDrawer({ user, onClose }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    logout()
    navigate('/')
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-paper rounded-t-3xl shadow-2xl">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 rounded-full bg-black/15" />
        </div>

        <div className="flex items-center gap-3 px-6 py-4 border-b border-black/8">
          <div className="w-11 h-11 rounded-full bg-ink flex items-center justify-center text-sm font-bold text-lime flex-shrink-0">
            {user?.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate">{user?.name}</div>
            <div className="text-xs text-muted truncate">{user?.email}</div>
          </div>
          <span className="ml-auto font-mono text-[10px] bg-ink text-lime px-2 py-0.5 rounded-md font-bold">DRIVER</span>
        </div>

        <nav className="px-4 py-3 space-y-0.5">
          {DRAWER_LINKS.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-ink hover:bg-paper2 transition-colors"
            >
              <span className="text-base w-6 text-center">{icon}</span>
              {label}
              <span className="ml-auto text-muted text-xs">→</span>
            </Link>
          ))}
        </nav>

        <div className="px-4 pb-6 pt-1 border-t border-black/8 mx-4">
          <button
            onClick={handleSignOut}
            className="w-full mt-3 py-3 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  )
}

function DesktopNav({ user }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-paper border-b border-black/10 sticky top-0 z-30">
      <Link to="/driver/dashboard" className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-ink rounded-lg flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
            <path d="M4 14V4h5.5a3 3 0 010 6H7" stroke="#C8FF3D" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </div>
        <span className="font-bold text-sm">ParkShare</span>
      </Link>
      <nav className="flex items-center gap-1">
        {DESKTOP_NAV.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end}
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
        <span className="text-sm text-muted">{user?.name?.split(' ')[0]}</span>
        <button
          onClick={() => { logout(); navigate('/') }}
          className="text-xs text-muted hover:text-ink font-medium transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}

export default function DriverLayout() {
  const { user, loading } = useAuth()
  const { key } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'driver') return <Navigate to={`/${user.role}/dashboard`} replace />

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <DesktopNav user={user} />

      {/* Mobile top header */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 bg-paper border-b border-black/10 sticky top-0 z-20">
        <Link to="/driver/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-ink rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M4 14V4h5.5a3 3 0 010 6H7" stroke="#C8FF3D" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-bold text-sm">ParkShare</span>
        </Link>
        <button
          onClick={() => setMenuOpen(true)}
          className="w-9 h-9 rounded-full bg-ink flex items-center justify-center text-xs font-bold text-lime active:scale-95 transition-transform"
          aria-label="Open menu"
        >
          {user?.name?.charAt(0)}
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 md:pb-0 pb-28">
        <div key={key} className="page-transition min-h-full">
          <Outlet />
        </div>
      </main>

      {/* Floating pill nav — mobile only */}
      <nav className="md:hidden pill-nav">
        {MOBILE_NAV.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `pill-nav-item${isActive ? ' active' : ''}`}>
            {label}
          </NavLink>
        ))}
      </nav>

      {menuOpen && <MobileMenuDrawer user={user} onClose={() => setMenuOpen(false)} />}
    </div>
  )
}
