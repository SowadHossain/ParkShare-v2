import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import StatusBadge from '../../../components/UI/StatusBadge.jsx'
import CountdownTimer from '../components/CountdownTimer.jsx'
import Loader from '../../../components/UI/Loader.jsx'

export default function BookingDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/bookings/${id}`)
      .then(r => setBooking(r.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader />
  if (!booking) return <div className="p-10 text-center text-muted">Booking not found.</div>

  const now = Date.now()
  const start = new Date(booking.start_time)
  const end = new Date(booking.end_time)
  const isActive    = booking.status === 'active' || (booking.status === 'paid' && now >= start && now <= end)
  const isCompleted = booking.status === 'completed' || (now > end && ['paid','active'].includes(booking.status))
  const canCancel   = ['pending', 'approved', 'paid'].includes(booking.status) && !isActive
  const canReview   = isCompleted && !booking.has_my_review

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <Link to="/driver/bookings" className="text-sm text-muted hover:text-ink mb-6 block">← My bookings</Link>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="font-mono text-xs text-muted tracking-wider mb-1">BOOKING #{id}</div>
          <h1 className="text-2xl font-bold tracking-tight">{booking.spot_title}</h1>
          <div className="text-sm text-muted mt-1">{booking.spot_address}</div>
        </div>
        <StatusBadge status={isCompleted ? 'completed' : booking.status} />
      </div>

      {/* Approval status banners */}
      {booking.status === 'pending' && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="font-semibold text-sm text-amber-800">Waiting for host approval</div>
          <p className="text-xs text-amber-700 mt-1">The host will review your request shortly. You'll be notified when it's approved.</p>
        </div>
      )}
      {booking.status === 'approved' && (
        <div className="mb-5 p-4 bg-lime/20 border border-lime rounded-2xl">
          <div className="font-semibold text-sm mb-1">Host approved your request!</div>
          <p className="text-xs text-muted mb-3">Proceed to payment to confirm your spot.</p>
          <button onClick={() => navigate(`/driver/checkout/${id}`)}
            className="w-full py-3 bg-ink text-paper rounded-full text-sm font-semibold hover:bg-ink/90 transition-colors">
            Pay now · ৳{parseFloat(booking.total_price).toFixed(2)} →
          </button>
        </div>
      )}
      {booking.status === 'rejected' && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <div className="font-semibold text-sm text-red-700">Request declined</div>
          <p className="text-xs text-red-600 mt-1">The host was unable to accept this booking.</p>
        </div>
      )}

      {isActive && <div className="mb-6"><CountdownTimer endTime={booking.end_time} /></div>}

      <div className="bg-white border border-black/10 rounded-2xl p-5 mb-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">From</span>
          <span className="font-medium">{start.toLocaleString('en-BD', { timeZone: 'Asia/Dhaka', dateStyle: 'medium', timeStyle: 'short' })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">To</span>
          <span className="font-medium">{end.toLocaleString('en-BD', { timeZone: 'Asia/Dhaka', dateStyle: 'medium', timeStyle: 'short' })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Host</span>
          <span className="font-medium">{booking.host_name}</span>
        </div>
        {booking.host_phone && (
          <div className="flex justify-between">
            <span className="text-muted">Host phone</span>
            <a href={`tel:${booking.host_phone}`} className="font-medium text-ink hover:underline">{booking.host_phone}</a>
          </div>
        )}
        <div className="flex justify-between pt-3 border-t border-black/10 font-bold">
          <span>{['paid','active','completed'].includes(booking.status) ? 'Total paid' : 'Total'}</span>
          <span className="font-mono">৳{parseFloat(booking.total_price).toFixed(2)}</span>
        </div>
      </div>

      {isCompleted && booking.has_my_review && (
        <div className="p-4 bg-paper2 border border-black/10 rounded-2xl mb-5 flex items-center gap-2 text-sm text-muted">
          <span>★</span> Review submitted — thank you!
        </div>
      )}
      {canReview && (
        <div className="p-4 bg-lime/20 border border-lime rounded-2xl mb-5">
          <div className="font-semibold text-sm mb-1">How was your experience?</div>
          <p className="text-xs text-muted mb-3">Help others by leaving a review.</p>
          <button onClick={() => navigate(`/driver/bookings/${id}/review`)}
            className="px-4 py-2 bg-ink text-paper rounded-full text-sm font-semibold hover:bg-ink/90 transition-colors">
            Write a review →
          </button>
        </div>
      )}

      {canCancel && (
        <button onClick={() => navigate(`/driver/bookings/${id}/cancel`)}
          className="w-full py-3.5 border border-red-200 text-red-600 rounded-full text-sm font-semibold hover:bg-red-50 transition-colors">
          Cancel booking
        </button>
      )}
    </div>
  )
}
