import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'
import ReviewForm from '../components/ReviewForm.jsx'
import Loader from '../../../components/UI/Loader.jsx'

export default function WriteReview() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`${API}/bookings/${id}`)
      .then(r => setBooking(r.data))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit({ rating, comment }) {
    setSubmitting(true)
    setError('')
    try {
      await axios.post(`${API}/reviews`, {
        bookingId: parseInt(id),
        revieweeId: booking.host_id,
        rating,
        comment,
      })
      navigate(`/driver/bookings/${id}/review/done`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review')
      setSubmitting(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <Link to={`/driver/bookings/${id}`} className="text-sm text-muted hover:text-ink mb-6 block">← Booking details</Link>
      <div className="font-mono text-xs text-muted tracking-wider mb-2">WRITE A REVIEW</div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">How was your stay?</h1>
      {booking && <p className="text-muted text-sm mb-8">Review your experience at <strong>{booking.spot_title}</strong>.</p>}
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
      <ReviewForm onSubmit={handleSubmit} loading={submitting} />
    </div>
  )
}
