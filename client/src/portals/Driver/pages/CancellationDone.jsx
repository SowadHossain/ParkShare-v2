import { Link } from 'react-router-dom'

export default function CancellationDone() {
  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      <div className="text-6xl mb-8">✓</div>
      <div className="font-mono text-xs text-muted tracking-wider mb-3">BOOKING CANCELLED</div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Booking cancelled.</h1>
      <p className="text-muted text-sm mb-10 leading-relaxed">
        Your booking has been cancelled successfully. If you paid, please contact support for refund assistance.
      </p>
      <div className="flex flex-col gap-3">
        <Link to="/driver/bookings" className="w-full py-4 bg-ink text-paper rounded-full font-semibold text-center hover:bg-ink/90 transition-colors">
          Back to bookings →
        </Link>
        <Link to="/driver/search" className="text-sm text-muted hover:text-ink transition-colors">
          Find new parking
        </Link>
      </div>
    </div>
  )
}
