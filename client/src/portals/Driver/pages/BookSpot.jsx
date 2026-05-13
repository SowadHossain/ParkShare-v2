import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'

function toLocalInput(d) {
  const dt = new Date(d)
  return dt.toISOString().slice(0,16)
}

export default function BookSpot() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [spot, setSpot] = useState(null)
  const [form, setForm] = useState({ startTime: '', endTime: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get(`${API}/spots/${id}`).then(r => setSpot(r.data))
  }, [id])

  const hours = form.startTime && form.endTime
    ? Math.max(0, (new Date(form.endTime) - new Date(form.startTime)) / 3600000)
    : 0
  const total = spot ? (hours * parseFloat(spot.hourly_price)).toFixed(2) : '0.00'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (hours <= 0) { setError('End time must be after start time'); return }
    setLoading(true)
    try {
      const res = await axios.post(`${API}/bookings`, {
        spotId: id,
        startTime: form.startTime,
        endTime: form.endTime,
      })
      navigate(`/driver/checkout/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  if (!spot) return <div className="p-10 text-center text-muted">Loading…</div>

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <Link to={`/driver/spots/${id}`} className="text-sm text-muted hover:text-ink mb-6 block">← Back to spot</Link>
      <div className="font-mono text-xs text-muted tracking-wider mb-2">BOOKING</div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">{spot.title}</h1>
      <p className="text-muted text-sm mb-8">{spot.address}</p>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="font-mono text-[11px] text-muted tracking-wider">FROM</label>
          <input type="datetime-local" required
            value={form.startTime || ''}
            onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
            className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20" />
        </div>
        <div>
          <label className="font-mono text-[11px] text-muted tracking-wider">TO</label>
          <input type="datetime-local" required
            value={form.endTime || ''}
            onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
            className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20" />
        </div>
        {hours > 0 && (
          <div className="p-4 bg-paper2 rounded-2xl">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">৳{parseFloat(spot.hourly_price).toFixed(0)} × {hours.toFixed(1)}h</span>
              <span className="font-mono font-bold">৳{total}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-black/10">
              <span>Total</span>
              <span className="font-mono">৳{total}</span>
            </div>
          </div>
        )}

        <button type="submit" disabled={loading || hours <= 0}
          className="w-full py-4 bg-ink text-paper rounded-full font-semibold hover:bg-ink/90 disabled:opacity-50 transition-colors">
          {loading ? 'Booking…' : `Continue to payment · ৳${total}`}
        </button>
      </form>
    </div>
  )
}
