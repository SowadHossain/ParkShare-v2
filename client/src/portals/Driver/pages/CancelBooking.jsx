import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import Loader from '../../../components/UI/Loader.jsx'

export default function CancelBooking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`${API}/bookings/${id}`)
      .then(r => setBooking(r.data))
      .finally(() => setLoading(false))
  }, [id])

  async function handleCancel() {
    setCancelling(true)
    try {
      await axios.patch(`${API}/bookings/${id}/cancel`)
      navigate(`/driver/bookings/${id}/cancel/done`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel')
      setCancelling(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <span className="text-2xl">⚠</span>
      </div>
      <div className="font-mono text-xs text-muted tracking-wider mb-3">CANCEL BOOKING</div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Are you sure?</h1>
      {booking && (
        <p className="text-muted text-sm mb-8 leading-relaxed">
          You're about to cancel your booking at <strong>{booking.spot_title}</strong>.
          This action cannot be undone. You won't be refunded automatically.
        </p>
      )}
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
      <div className="flex flex-col gap-3">
        <button onClick={handleCancel} disabled={cancelling}
          className="w-full py-4 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors">
          {cancelling ? 'Cancelling…' : 'Yes, cancel booking'}
        </button>
        <Link to={`/driver/bookings/${id}`} className="text-sm text-muted hover:text-ink transition-colors">
          Keep my booking
        </Link>
      </div>
    </div>
  )
}
