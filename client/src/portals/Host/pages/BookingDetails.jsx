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
  const [acting, setActing] = useState(false)

  const reload = () => {
    axios.get(`${API}/bookings/${id}`)
      .then(r => setBooking(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { reload() }, [id])

  if (loading) return <Loader />
  if (!booking) return <div className="p-10 text-center text-muted">Booking not found.</div>

  const isCompleted = booking.status === 'completed'
    || (new Date() > new Date(booking.end_time) && ['paid','active'].includes(booking.status))

  async function handleApprove() {
    setActing(true)
    try {
      await axios.post(`${API}/bookings/${id}/approve`)
      reload()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve')
    } finally {
      setActing(false)
    }
  }

  async function handleReject() {
    setActing(true)
    try {
      await axios.post(`${API}/bookings/${id}/reject`)
      reload()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject')
    } finally {
      setActing(false)
    }
  }

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

      {/* Approval actions */}
      {booking.status === 'pending' && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="font-semibold text-sm text-amber-800 mb-3">New booking request</div>
          <div className="flex gap-2">
            <button onClick={handleApprove} disabled={acting}
              className="flex-1 py-2.5 bg-ink text-paper rounded-xl text-sm font-semibold hover:bg-ink/90 disabled:opacity-50 transition-colors">
              {acting ? '…' : 'Approve'}
            </button>
            <button onClick={handleReject} disabled={acting}
              className="flex-1 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 disabled:opacity-50 transition-colors">
              {acting ? '…' : 'Decline'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-black/10 rounded-2xl p-5 mb-5 space-y-3 text-sm">
        {[
          ['From', new Date(booking.start_time).toLocaleString('en-BD', { timeZone: 'Asia/Dhaka', dateStyle: 'medium', timeStyle: 'short' })],
          ['To', new Date(booking.end_time).toLocaleString('en-BD', { timeZone: 'Asia/Dhaka', dateStyle: 'medium', timeStyle: 'short' })],
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
          <span className="font-mono">৳{(parseFloat(booking.total_price) * 0.85).toFixed(2)}</span>
        </div>
      </div>
      {isCompleted && booking.has_my_review && (
        <div className="p-4 bg-paper2 border border-black/10 rounded-2xl flex items-center gap-2 text-sm text-muted">
          <span>★</span> Review submitted — thank you!
        </div>
      )}
      {isCompleted && !booking.has_my_review && (
        <button onClick={() => navigate(`/host/bookings/${id}/review`)}
          className="w-full py-3.5 bg-ink text-paper rounded-full font-semibold text-sm hover:bg-ink/90 transition-colors">
          Write a review for driver →
        </button>
      )}
    </div>
  )
}
