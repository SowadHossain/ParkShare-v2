import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import StatusBadge from '../../../components/UI/StatusBadge.jsx'

export default function CheckoutReview() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/bookings/${bookingId}`)
      .then(r => setBooking(r.data))
      .finally(() => setLoading(false))
  }, [bookingId])

  if (loading) return <Loader />
  if (!booking) return <div className="p-10 text-center text-muted">Booking not found.</div>

  const start = new Date(booking.start_time)
  const end = new Date(booking.end_time)
  const hours = ((end - start) / 3600000).toFixed(1)
  const fmt = d => d.toLocaleString('en-BD', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <div className="font-mono text-xs text-muted tracking-wider mb-2">BOOKING REVIEW</div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Confirm your booking.</h1>

      <div className="bg-white border border-black/10 rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="font-semibold">{booking.spot_title}</div>
            <div className="text-xs text-muted mt-1">{booking.spot_address}</div>
          </div>
          <StatusBadge status={booking.status} />
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">From</span>
            <span className="font-medium">{fmt(start)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">To</span>
            <span className="font-medium">{fmt(end)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Duration</span>
            <span className="font-medium">{hours}h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Host</span>
            <span className="font-medium">{booking.host_name}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-black/10 flex justify-between font-bold">
          <span>Total</span>
          <span className="font-mono text-lg">${parseFloat(booking.total_price).toFixed(2)}</span>
        </div>
      </div>

      <div className="p-4 bg-lime/20 border border-lime rounded-2xl text-sm text-ink mb-6 leading-relaxed">
        <strong>Test mode:</strong> Use card 4242 4242 4242 4242 with any future date and any CVC.
      </div>

      <div className="flex flex-col gap-3">
        <button onClick={() => navigate(`/driver/checkout/${bookingId}/pay`)}
          className="w-full py-4 bg-ink text-paper rounded-full font-semibold hover:bg-ink/90 transition-colors">
          Pay now · ${parseFloat(booking.total_price).toFixed(2)} →
        </button>
        <Link to="/driver/bookings" className="text-center text-sm text-muted hover:text-ink transition-colors">Cancel</Link>
      </div>
    </div>
  )
}
