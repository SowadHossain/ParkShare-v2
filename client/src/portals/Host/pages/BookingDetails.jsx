import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import StatusBadge from '../../../components/UI/StatusBadge.jsx'
import Loader from '../../../components/UI/Loader.jsx'

export default function HostBookingDetails() {
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

  const isCompleted = booking.status === 'completed'
    || (new Date() > new Date(booking.end_time) && ['paid','active'].includes(booking.status))

  return (
    <div className="max-w-md mx-auto p-8">
      <Link to="/host/bookings" className="text-sm text-muted hover:text-ink mb-6 block">← All bookings</Link>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="font-mono text-xs text-muted tracking-wider mb-1">BOOKING #{id}</div>
          <h1 className="text-2xl font-bold tracking-tight">{booking.driver_name}</h1>
          <div className="text-sm text-muted mt-1">{booking.spot_title}</div>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="bg-white border border-black/10 rounded-2xl p-5 mb-5 space-y-3 text-sm">
        {[
          ['From', new Date(booking.start_time).toLocaleString()],
          ['To', new Date(booking.end_time).toLocaleString()],
          ['Driver phone', booking.driver_phone || 'Not provided'],
          ['Driver email', booking.driver_email],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-muted">{k}</span>
            <span className="font-medium text-right max-w-[220px] truncate">{v}</span>
          </div>
        ))}
        <div className="flex justify-between pt-3 border-t border-black/10 font-bold">
          <span>Earned</span>
          <span className="font-mono">${(parseFloat(booking.total_price) * 0.85).toFixed(2)}</span>
        </div>
      </div>
      {isCompleted && (
        <button onClick={() => navigate(`/host/bookings/${id}/review`)}
          className="w-full py-3.5 bg-ink text-paper rounded-full font-semibold text-sm hover:bg-ink/90 transition-colors">
          Write a review for driver →
        </button>
      )}
    </div>
  )
}
