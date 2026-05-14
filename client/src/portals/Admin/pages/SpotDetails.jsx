import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import StarRating from '../../../components/UI/StarRating.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import ConfirmDialog from '../../../components/UI/ConfirmDialog.jsx'

export default function AdminSpotDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [spot, setSpot] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/spots/${id}`),
      axios.get(`${API}/reviews/spot/${id}`).catch(() => ({ data: [] })),
    ]).then(([sr, rr]) => {
      setSpot(sr.data)
      setReviews(rr.data)
    }).finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    await axios.delete(`${API}/spots/${id}`)
    navigate('/admin/spots')
  }

  async function toggleActive() {
    const { data } = await axios.patch(`${API}/spots/${id}`, { is_active: !spot.is_active })
    setSpot(prev => ({ ...prev, is_active: data.is_active }))
  }

  if (loading) return <Loader />
  if (!spot) return <div className="p-10 text-center text-muted">Spot not found.</div>

  const fields = [
    ['Address', spot.address],
    ['Price', `৳${parseFloat(spot.hourly_price).toFixed(0)}/hr`],
    ['Vehicle size', spot.vehicle_size],
    ['Status', spot.is_active ? 'Active' : 'Paused'],
    ['Host', spot.host_name],
    ['Available', `${spot.available_from ? new Date(spot.available_from).toLocaleDateString() : '—'} → ${spot.available_to ? new Date(spot.available_to).toLocaleDateString() : '—'}`],
    ['Avg rating', spot.avg_rating ? `${parseFloat(spot.avg_rating).toFixed(1)} / 5` : 'No reviews'],
  ]

  return (
    <div className="p-8 max-w-2xl">
      <Link to="/admin/spots" className="text-sm text-muted hover:text-ink mb-6 block">← All spots</Link>

      <div className="mb-6">
        <div className="font-mono text-xs text-muted tracking-wider mb-1">SPOT #{id}</div>
        <h1 className="text-2xl font-bold tracking-tight">{spot.title}</h1>
        {spot.description && <p className="text-sm text-muted mt-2">{spot.description}</p>}
      </div>

      <div className="bg-white border border-black/10 rounded-2xl p-5 space-y-3 text-sm mb-6">
        {fields.map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-muted">{k}</span>
            <span className="font-medium">{v}</span>
          </div>
        ))}
        {spot.rules && (
          <div className="pt-3 border-t border-black/10">
            <div className="text-muted mb-1">Rules</div>
            <div className="text-sm">{spot.rules}</div>
          </div>
        )}
      </div>

      {reviews.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold text-base mb-3">Reviews ({reviews.length})</h2>
          <div className="flex flex-col gap-2">
            {reviews.slice(0, 5).map(r => (
              <div key={r.id} className="p-3 bg-white border border-black/10 rounded-xl text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <StarRating value={r.rating} size="sm" />
                  <span className="text-xs text-muted">by {r.reviewer_name}</span>
                </div>
                {r.comment && <p className="text-muted text-xs">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={toggleActive}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            spot.is_active
              ? 'bg-paper2 text-ink hover:bg-paper2/70'
              : 'bg-lime text-ink hover:bg-lime/80'
          }`}>
          {spot.is_active ? 'Pause spot' : 'Activate spot'}
        </button>
        <button onClick={() => setShowDelete(true)}
          className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
          Delete spot
        </button>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="Delete spot?"
        message={`Permanently delete "${spot.title}" and all associated bookings?`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  )
}
