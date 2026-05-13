import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useEffect } from 'react'

const NAV = [
  { to: '/admin',         label: 'Dashboard', icon: '◈', end: true },
  { to: '/admin/users',   label: 'Users',     icon: '◉'            },
  { to: '/admin/spots',   label: 'Spots',     icon: '▤'            },
  { to: '/admin/reviews', label: 'Reviews',   icon: '★'            },
  { to: '/admin/kyc',     label: 'KYC',       icon: '⊛'            },
]

const MOBILE_NAV = [
  { to: '/admin',         label: 'Dashboard', end: true },
  { to: '/admin/users',   label: 'Users'               },
  { to: '/admin/spots',   label: 'Spots'               },
  { to: '/admin/reviews', label: 'Reviews'             },
  { to: '/admin/kyc',     label: 'KYC'                 },
]

export default function AdminLayout() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const { key } = useLocation()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) navigate('/login', { replace: true })
  }, [user, loading, navigate])

  if (loading || !user) return null

  return (
    <div className="flex min-h-screen bg-paper">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-ink text-paper flex-col flex-shrink-0 h-screen sticky top-0">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 bg-lime rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M4 14V4h5.5a3 3 0 010 6H7" stroke="#0E0E0C" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </div>
            <div className="font-bold text-sm">ParkShare <span className="text-lime font-mono text-[10px] ml-1">ADMIN</span></div>
          </div>
          <div className="text-xs text-paper/50">{user.name}</div>
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
        <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
          <NavLink to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-paper/40 hover:text-paper/70 transition-colors">
            <span>↗</span> Back to site
          </NavLink>
          <button onClick={() => { logout(); navigate('/') }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-paper/40 hover:text-paper/70 transition-colors">
            <span>↩</span> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top header */}
        <header className="md:hidden flex items-center justify-between px-5 py-4 bg-paper border-b border-black/10 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-ink rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M4 14V4h5.5a3 3 0 010 6H7" stroke="#C8FF3D" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-bold text-sm">ParkShare <span className="text-muted font-mono text-[10px]">ADMIN</span></span>
          </div>
          <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-xs font-bold text-lime">
            {user?.name?.charAt(0)}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-28 md:pb-0">
          <div key={key} className="page-transition">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating pill nav — mobile only */}
      <nav className="md:hidden pill-nav">
        {MOBILE_NAV.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `pill-nav-item${isActive ? ' active' : ''}`}>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
