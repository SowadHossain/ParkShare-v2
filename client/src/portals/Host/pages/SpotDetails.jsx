import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import Loader from '../../../components/UI/Loader.jsx'

export default function HostSpotDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [spot, setSpot] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/spots/${id}`).then(r => setSpot(r.data)).finally(() => setLoading(false))
  }, [id])

  async function toggleActive() {
    await axios.put(`${API}/spots/${id}`, { is_active: !spot.is_active })
    setSpot(s => ({ ...s, is_active: !s.is_active }))
  }

  if (loading) return <Loader />
  if (!spot) return <div className="p-10 text-center text-muted">Spot not found.</div>

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link to="/host/spots" className="text-sm text-muted hover:text-ink mb-6 block">← My spots</Link>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{spot.title}</h1>
          <div className="text-muted text-sm mt-1">{spot.address}</div>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold ${spot.is_active ? 'bg-lime text-ink' : 'bg-paper2 text-muted'}`}>
          {spot.is_active ? 'Active' : 'Paused'}
        </span>
      </div>

      <div className="bg-white border border-black/10 rounded-2xl p-5 mb-5 space-y-3 text-sm">
        {[
          ['Price', `৳${parseFloat(spot.hourly_price).toFixed(0)}/hr`],
          ['Vehicle size', spot.vehicle_size],
          ['Available', spot.available_from ? `${spot.available_from} – ${spot.available_to}` : 'Not set'],
          ['Rating', `★ ${parseFloat(spot.avg_rating || 0).toFixed(1)} · ${spot.review_count} reviews`],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-muted">{k}</span>
            <span className="font-medium">{v}</span>
          </div>
        ))}
        {spot.description && (
          <div className="pt-2 border-t border-black/10">
            <div className="text-muted mb-1">Description</div>
            <p className="text-sm leading-relaxed">{spot.description}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Link to={`/host/spots/${id}/edit`}
          className="w-full py-3.5 bg-ink text-paper rounded-full font-semibold text-sm text-center hover:bg-ink/90 transition-colors">
          Edit listing →
        </Link>
        <button onClick={toggleActive}
          className="w-full py-3.5 border border-black/10 rounded-full font-semibold text-sm hover:bg-paper2 transition-colors">
          {spot.is_active ? 'Pause listing' : 'Resume listing'}
        </button>
        <Link to={`/host/spots/${id}/delete`}
          className="w-full py-3.5 border border-red-200 text-red-600 rounded-full font-semibold text-sm text-center hover:bg-red-50 transition-colors">
          Delete listing
        </Link>
      </div>
    </div>
  )
}
