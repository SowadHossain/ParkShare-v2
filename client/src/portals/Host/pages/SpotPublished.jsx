import { Link } from 'react-router-dom'

export default function SpotPublished() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 bg-lime rounded-full flex items-center justify-center mx-auto mb-8">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M8 18l7 7 13-13" stroke="#0E0E0C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="font-mono text-xs text-muted tracking-widest mb-3">SPOT PUBLISHED</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">You're live!</h1>
        <p className="text-muted text-sm mb-10 leading-relaxed">
          Your driveway is now visible to drivers in your area. Bookings will appear in your dashboard.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/host/spots" className="w-full py-4 bg-ink text-paper rounded-full font-semibold text-center hover:bg-ink/90 transition-colors">
            View my spots →
          </Link>
          <Link to="/host/spots/new/location" className="text-sm text-muted hover:text-ink transition-colors">Add another spot</Link>
        </div>
      </div>
    </div>
  )
}
