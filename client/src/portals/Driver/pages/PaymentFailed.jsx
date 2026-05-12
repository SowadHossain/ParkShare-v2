import { useParams, Link, useNavigate } from 'react-router-dom'

export default function PaymentFailed() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M10 10l16 16M26 10L10 26" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <div className="font-mono text-xs text-muted tracking-widest mb-3">PAYMENT FAILED</div>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Something went wrong.</h1>
      <p className="text-muted text-sm mb-8 leading-relaxed">
        Your card was not charged. Please check your card details and try again.
      </p>
      <div className="flex flex-col gap-3">
        <button onClick={() => navigate(`/driver/checkout/${bookingId}/pay`)}
          className="w-full py-4 bg-ink text-paper rounded-full font-semibold hover:bg-ink/90 transition-colors">
          Try again →
        </button>
        <Link to={`/driver/checkout/${bookingId}`} className="text-sm text-muted hover:text-ink transition-colors">
          Back to booking review
        </Link>
      </div>
    </div>
  )
}
