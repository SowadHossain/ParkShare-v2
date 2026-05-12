import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'
import StarRating from '../../../components/UI/StarRating.jsx'
import Button from '../../../components/UI/Button.jsx'
import Loader from '../../../components/UI/Loader.jsx'

export default function HostWriteReview() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`${API}/bookings/${id}`).then(r => setBooking(r.data)).finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!rating) return
    setSubmitting(true)
    try {
      await axios.post(`${API}/reviews`, {
        bookingId: parseInt(id),
        revieweeId: booking.driver_id,
        rating,
        comment,
      })
      navigate('/host/bookings')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit')
      setSubmitting(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="max-w-md mx-auto p-8">
      <Link to={`/host/bookings/${id}`} className="text-sm text-muted hover:text-ink mb-6 block">← Booking details</Link>
      <div className="font-mono text-xs text-muted tracking-wider mb-2">WRITE A REVIEW</div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Rate this driver.</h1>
      {booking && <p className="text-muted text-sm mb-8">Share your experience with <strong>{booking.driver_name}</strong>.</p>}
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="font-mono text-[11px] text-muted tracking-wider block mb-3">RATING</label>
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>
        <div>
          <label className="font-mono text-[11px] text-muted tracking-wider block mb-2">COMMENT</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4}
            placeholder="How was this driver?"
            className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 resize-none" />
        </div>
        <Button type="submit" disabled={!rating || submitting} fullWidth>
          {submitting ? 'Submitting…' : 'Submit review →'}
        </Button>
      </form>
    </div>
  )
}
