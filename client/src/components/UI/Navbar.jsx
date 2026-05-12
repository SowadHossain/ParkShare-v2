import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-lime rounded-[10px] flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M4 14V4h5.5a3 3 0 010 6H7" stroke="#0E0E0C" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>
      <span className="text-lg font-bold tracking-tight">ParkShare</span>
    </div>
  )
}

export function PublicNavbar() {
  return (
    <nav className="flex items-center justify-between px-8 md:px-14 py-4 border-b border-black/10 bg-paper">
      <Link to="/"><Logo /></Link>
      <div className="hidden md:flex items-center gap-7 text-sm font-medium">
        <Link to="/" className="text-muted hover:text-ink transition-colors">Home</Link>
        <Link to="/how-it-works" className="text-muted hover:text-ink transition-colors">How it works</Link>
        <Link to="/about" className="text-muted hover:text-ink transition-colors">About</Link>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login" className="text-sm font-medium text-muted hover:text-ink transition-colors">Sign in</Link>
        <Link to="/register" className="px-4 py-2.5 bg-lime text-ink rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
          Get started →
        </Link>
      </div>
    </nav>
  )
}

export function DriverNavbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <nav className="flex items-center justify-between px-6 py-3.5 border-b border-black/10 bg-paper">
      <Link to="/driver/dashboard"><Logo /></Link>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link to="/driver/search" className="text-muted hover:text-ink transition-colors">Find parking</Link>
        <Link to="/driver/bookings" className="text-muted hover:text-ink transition-colors">My bookings</Link>
        <Link to="/driver/notifications" className="text-muted hover:text-ink transition-colors">Notifications</Link>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/driver/profile" className="w-9 h-9 rounded-full bg-paper2 flex items-center justify-center text-sm font-bold hover:bg-ink hover:text-paper transition-all">
          {user?.name?.charAt(0)?.toUpperCase() || 'D'}
        </Link>
        <button onClick={() => { logout(); navigate('/') }} className="text-sm text-muted hover:text-ink font-medium transition-colors">
          Sign out
        </button>
      </div>
    </nav>
  )
}

export default function Navbar({ role }) {
  if (role === 'driver') return <DriverNavbar />
  return <PublicNavbar />
}
