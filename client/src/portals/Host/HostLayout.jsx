import { useState } from 'react'
import { Outlet, Navigate, NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Loader from '../../components/UI/Loader.jsx'

const MOBILE_NAV = [
  { to: '/host/dashboard',  label: 'Home'     },
  { to: '/host/spots',      label: 'Spots'    },
  { to: '/host/bookings',   label: 'Bookings' },
  { to: '/host/earnings',   label: 'Earnings' },
]

const SIDEBAR_LINKS = [
  { to: '/host/dashboard',     label: 'Dashboard',     ic: '▭' },
  { to: '/host/spots',         label: 'My spots',      ic: '▤' },
  { to: '/host/bookings',      label: 'Bookings',      ic: '◷' },
  { to: '/host/earnings',      label: 'Earnings',      ic: '৳' },
  { to: '/host/notifications', label: 'Notifications', ic: '♥' },
  { to: '/host/profile',       label: 'Profile',       ic: '◉' },
]

const DRAWER_LINKS = [
  { to: '/host/notifications', label: 'Notifications', icon: '🔔' },
  { to: '/host/profile',       label: 'Profile',       icon: '👤' },
  { to: '/host/profile/edit',  label: 'Edit Profile',  icon: '✏️' },
  { to: '/host/settings',      label: 'Settings',      icon: '⚙️' },
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 md:hidden"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-paper rounded-t-3xl shadow-2xl">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 rounded-full bg-black/15" />
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-black/8">
          <div className="w-11 h-11 rounded-full bg-ink flex items-center justify-center text-sm font-bold text-lime flex-shrink-0">
            {user?.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate">{user?.name}</div>
            <div className="text-xs text-muted truncate">{user?.email}</div>
          </div>
          <span className="ml-auto font-mono text-[10px] bg-lime px-2 py-0.5 rounded-md font-bold">HOST</span>
        </div>

        {/* Links */}
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

        {/* Sign out */}
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

function HostSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="hidden md:flex w-56 flex-shrink-0 bg-ink text-paper flex-col h-screen sticky top-0">
      <div className="px-5 py-6 border-b border-white/8 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-lime rounded-[9px] flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 14V4h5.5a3 3 0 010 6H7" stroke="#0E0E0C" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </div>
        <div className="text-sm font-bold">
          ParkShare <span className="text-lime font-mono text-[10px] ml-1">HOST</span>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {SIDEBAR_LINKS.map(l => (
          <NavLink key={l.to} to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-white/10 text-paper' : 'text-paper/60 hover:text-paper/90 hover:bg-white/5'
              }`
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
  const { key } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'host') return <Navigate to={`/${user.role}/dashboard`} replace />

  return (
    <div className="flex min-h-screen bg-paper">
      <HostSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top header */}
        <header className="md:hidden flex items-center justify-between px-5 py-4 bg-paper border-b border-black/10 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-lime rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M4 14V4h5.5a3 3 0 010 6H7" stroke="#0E0E0C" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-bold text-sm">ParkShare <span className="text-muted font-mono text-[10px]">HOST</span></span>
          </div>
          {/* Tappable avatar → opens full menu drawer */}
          <button
            onClick={() => setMenuOpen(true)}
            className="w-9 h-9 rounded-full bg-ink flex items-center justify-center text-xs font-bold text-lime active:scale-95 transition-transform"
            aria-label="Open menu"
          >
            {user?.name?.charAt(0)}
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto pb-28 md:pb-0">
          <div key={key} className="page-transition">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating pill nav — mobile only */}
      <nav className="md:hidden pill-nav">
        {MOBILE_NAV.map(({ to, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => `pill-nav-item${isActive ? ' active' : ''}`}>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && <MobileMenuDrawer user={user} onClose={() => setMenuOpen(false)} />}
    </div>
  )
}
