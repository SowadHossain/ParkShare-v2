import { useState } from 'react'
import { Outlet, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Loader from '../../components/UI/Loader.jsx'

const LINKS = [
  { to: '/host/dashboard',     label: 'Dashboard',    ic: '▭' },
  { to: '/host/spots',         label: 'My spots',     ic: '▤' },
  { to: '/host/bookings',      label: 'Bookings',     ic: '◷' },
  { to: '/host/earnings',      label: 'Earnings',     ic: '$' },
  { to: '/host/notifications', label: 'Notifications', ic: '♥' },
  { to: '/host/profile',       label: 'Profile',       ic: '◉' },
]

function HostSidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-30" onClick={onClose} />
      )}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-56 flex-shrink-0 bg-ink text-paper flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="px-5 py-6 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-lime rounded-[9px] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 14V4h5.5a3 3 0 010 6H7" stroke="#0E0E0C" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-sm font-bold">ParkShare <span className="text-lime font-mono text-[10px] ml-1">HOST</span></div>
          </div>
          <button onClick={onClose} className="md:hidden text-paper/50 hover:text-paper p-1">✕</button>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-white/8 text-paper' : 'text-paper/60 hover:text-paper/90'
                }`
              }>
              <span className="font-mono text-xs w-4 text-center opacity-70">{l.ic}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 pb-5 safe-bottom">
          <button onClick={() => { logout(); navigate('/') }}
            className="w-full py-2.5 text-xs text-paper/50 hover:text-paper/80 transition-colors font-medium">
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}

export default function HostLayout() {
  const { user, loading } = useAuth()
  const { key } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'host') return <Navigate to={`/${user.role}/dashboard`} replace />

  return (
    <div className="flex min-h-screen bg-paper">
      <HostSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-black/10 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-paper2 transition-colors">
            <span className="text-xl">☰</span>
          </button>
          <div className="font-bold text-sm">ParkShare <span className="text-muted font-mono text-[10px]">HOST</span></div>
          <div className="w-9" />
        </header>
        <main className="flex-1 overflow-auto">
          <div key={key} className="page-transition">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
