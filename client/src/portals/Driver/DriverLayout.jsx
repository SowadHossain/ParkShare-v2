import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { DriverNavbar } from '../../components/UI/Navbar.jsx'
import Loader from '../../components/UI/Loader.jsx'

const BOTTOM_NAV = [
  { to: '/driver/search',        icon: '⊕', label: 'Search'    },
  { to: '/driver/bookings',      icon: '◷', label: 'Bookings'  },
  { to: '/driver/notifications', icon: '♥', label: 'Alerts'    },
  { to: '/driver/profile',       icon: '◉', label: 'Profile'   },
]

export default function DriverLayout() {
  const { user, loading } = useAuth()
  const { key } = useLocation()

  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'driver') return <Navigate to={`/${user.role}/dashboard`} replace />

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      {/* Top navbar — hidden on mobile */}
      <div className="hidden md:block">
        <DriverNavbar />
      </div>

      <main className="flex-1 pb-16 md:pb-0">
        <div key={key} className="page-transition min-h-full">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-black/10 mobile-bottom-nav z-40 flex">
        {BOTTOM_NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-[10px] font-mono tracking-wider transition-colors ${
                isActive ? 'text-ink' : 'text-muted'
              }`
            }
          >
            <span className="text-lg leading-none">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
