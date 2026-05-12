import { Link } from 'react-router-dom'

export default function ReviewDone() {
  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      <div className="text-6xl mb-8">★</div>
      <div className="font-mono text-xs text-muted tracking-wider mb-3">REVIEW SUBMITTED</div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Thanks for your review!</h1>
      <p className="text-muted text-sm mb-10 leading-relaxed">
        Your feedback helps other drivers choose great spots and rewards good hosts.
      </p>
      <div className="flex flex-col gap-3">
        <Link to="/driver/bookings" className="w-full py-4 bg-ink text-paper rounded-full font-semibold text-center hover:bg-ink/90 transition-colors">
          Back to bookings →
        </Link>
        <Link to="/driver/search" className="text-sm text-muted hover:text-ink transition-colors">
          Find parking again
        </Link>
      </div>
    </div>
  )
}
