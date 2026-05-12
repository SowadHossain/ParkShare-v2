import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import StarRating from '../../../components/UI/StarRating.jsx'
import Loader from '../../../components/UI/Loader.jsx'

const GRADIENTS = ['from-[#5C6B4E] to-[#B8C098]','from-[#6F584A] to-[#C8B49B]','from-[#4F6A78] to-[#A8C0CB]']

export default function DriverSpotDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [spot, setSpot] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/spots/${id}`),
      axios.get(`${API}/reviews/spot/${id}`),
    ]).then(([s, r]) => {
      setSpot(s.data)
      setReviews(r.data)
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader />
  if (!spot) return <div className="p-10 text-center text-muted">Spot not found.</div>

  const rating = parseFloat(spot.avg_rating || 0)

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex gap-2 text-xs text-muted mb-5">
        <Link to="/driver/search" className="hover:text-ink">Find parking</Link>
        <span>→</span>
        <span className="text-ink font-medium">{spot.title}</span>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-3 grid-rows-2 gap-2 h-72 md:h-96 mb-8 rounded-2xl overflow-hidden">
        <div className={`col-span-2 row-span-2 bg-gradient-to-br ${GRADIENTS[0]}`} />
        <div className={`bg-gradient-to-br ${GRADIENTS[1]}`} />
        <div className={`bg-gradient-to-br ${GRADIENTS[2]} relative`}>
          <button className="absolute right-2 bottom-2 px-3 py-1.5 bg-white rounded-full text-xs font-semibold shadow-sm">
            View all →
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_340px] gap-10 items-start">
        <div>
          <div className="font-mono text-xs text-muted tracking-wider mb-1">SPOT #{String(spot.id).padStart(4,'0')}</div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">{spot.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted mb-6">
            <span>★ <strong className="text-ink">{rating.toFixed(1)}</strong> · {reviews.length} reviews</span>
            <span>·</span>
            <span>Hosted by <strong className="text-ink">{spot.host_name}</strong></span>
            <span>·</span>
            <span>{spot.address}</span>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {[
              { ic: '⌂', t: `Fits ${spot.vehicle_size}`, s: 'Vehicle size' },
              { ic: '☂', t: spot.available_from ? `${spot.available_from} – ${spot.available_to}` : 'Check availability', s: 'Available hours' },
              { ic: '♦', t: `$${parseFloat(spot.hourly_price).toFixed(2)}/hr`, s: 'Hourly rate' },
            ].map(f => (
              <div key={f.t} className="p-4 bg-white border border-black/10 rounded-2xl">
                <div className="text-2xl mb-2">{f.ic}</div>
                <div className="text-sm font-semibold">{f.t}</div>
                <div className="text-xs text-muted mt-0.5">{f.s}</div>
              </div>
            ))}
          </div>

          {spot.description && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-3">About this spot</h3>
              <p className="text-muted text-sm leading-relaxed">{spot.description}</p>
            </div>
          )}

          {spot.rules && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-3">House rules</h3>
              <div className="p-4 bg-paper2 rounded-2xl text-sm text-muted leading-relaxed whitespace-pre-line">{spot.rules}</div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <h3 className="text-lg font-bold mb-4">Reviews · {reviews.length}</h3>
            {reviews.length === 0
              ? <p className="text-muted text-sm">No reviews yet.</p>
              : <div className="grid md:grid-cols-2 gap-3">
                  {reviews.slice(0, 6).map(r => (
                    <div key={r.id} className="p-4 bg-white border border-black/10 rounded-2xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-paper2 flex items-center justify-center text-xs font-bold">
                          {r.reviewer_name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{r.reviewer_name}</div>
                          <div className="text-xs text-muted">{new Date(r.created_at).toLocaleDateString()}</div>
                        </div>
                        <StarRating value={r.rating} size="sm" />
                      </div>
                      {r.comment && <p className="text-sm text-ink/80 leading-relaxed">{r.comment}</p>}
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>

        {/* Booking card */}
        <div className="sticky top-4 bg-white border border-black/10 rounded-2xl p-5 shadow-sm">
          <div className="flex items-baseline gap-2 mb-5">
            <span className="font-mono text-4xl font-bold">${parseFloat(spot.hourly_price).toFixed(2)}</span>
            <span className="text-sm text-muted">/ hour</span>
          </div>
          {user ? (
            <button
              onClick={() => navigate(`/driver/spots/${spot.id}/book`)}
              className="w-full py-4 bg-ink text-paper rounded-full font-semibold hover:bg-ink/90 transition-colors">
              Book this spot →
            </button>
          ) : (
            <Link to="/login" className="block w-full py-4 bg-ink text-paper rounded-full font-semibold text-center hover:bg-ink/90 transition-colors">
              Sign in to book
            </Link>
          )}
          <p className="text-center text-xs text-muted mt-3">You won't be charged yet</p>
          <div className="mt-5 pt-5 border-t border-black/10 flex items-center justify-between text-sm">
            <span className="text-muted">Avg rating</span>
            <span className="font-semibold">★ {rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
