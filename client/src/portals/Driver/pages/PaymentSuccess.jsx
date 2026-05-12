import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'

export default function PaymentSuccess() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    axios.get(`${API}/bookings/${bookingId}`).then(r => setBooking(r.data)).catch(() => {})
  }, [bookingId])

  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      <div className="w-20 h-20 bg-lime rounded-full flex items-center justify-center mx-auto mb-8">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M8 18l7 7 13-13" stroke="#0E0E0C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="font-mono text-xs text-muted tracking-widest mb-3">PAYMENT CONFIRMED</div>
      <h1 className="text-4xl font-bold tracking-tight mb-4">You're all set!</h1>
      {booking && (
        <div className="p-4 bg-white border border-black/10 rounded-2xl text-left mb-8">
          <div className="font-semibold text-sm mb-1">{booking.spot_title}</div>
          <div className="text-xs text-muted">{booking.spot_address}</div>
          <div className="font-mono text-xs text-muted mt-3">
            {new Date(booking.start_time).toLocaleString()} → {new Date(booking.end_time).toLocaleTimeString()}
          </div>
          <div className="font-mono text-lg font-bold mt-2">${parseFloat(booking.total_price).toFixed(2)} paid</div>
        </div>
      )}
      <div className="flex flex-col gap-3">
        <Link to={`/driver/bookings/${bookingId}`} className="w-full py-4 bg-ink text-paper rounded-full font-semibold text-center hover:bg-ink/90 transition-colors">
          View booking details →
        </Link>
        <Link to="/driver/bookings" className="text-sm text-muted hover:text-ink transition-colors">
          See all bookings
        </Link>
      </div>
    </div>
  )
}
