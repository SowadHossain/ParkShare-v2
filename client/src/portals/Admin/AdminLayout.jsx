import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useEffect } from 'react'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '◈', end: true },
  { to: '/admin/users', label: 'Users', icon: '👤' },
  { to: '/admin/spots', label: 'Spots', icon: '🅿' },
  { to: '/admin/reviews', label: 'Reviews', icon: '★' },
]

export default function AdminLayout() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) navigate('/login', { replace: true })
  }, [user, loading, navigate])

  const { key } = useLocation()

  if (loading || !user) return null

  return (
    <div className="flex h-screen bg-paper overflow-hidden">
      <aside className="w-60 bg-ink text-paper flex flex-col flex-shrink-0">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="font-mono text-xs text-paper/40 tracking-widest mb-1">PARKSHARE</div>
          <div className="font-bold text-lg">Admin</div>
          <div className="text-xs text-paper/50 mt-0.5">{user.name}</div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive ? 'bg-white/10 text-paper font-semibold' : 'text-paper/60 hover:text-paper hover:bg-white/5'
                }`
              }>
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <NavLink to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-paper/40 hover:text-paper/70 transition-colors">
            <span>↗</span> Back to site
          </NavLink>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div key={key} className="page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
