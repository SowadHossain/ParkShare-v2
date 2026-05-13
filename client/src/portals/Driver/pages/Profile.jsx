import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'
import { Link } from 'react-router-dom'
import axios from 'axios'
import StarRating from '../../../components/UI/StarRating.jsx'

export default function DriverProfile() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    if (user) axios.get(`${API}/reviews/user/${user.id}`).then(r => setReviews(r.data)).catch(() => {})
  }, [user?.id])

  if (!user) return null

  return (
    <div className="max-w-lg mx-auto px-5 py-8">
      <Link to="/driver/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-6">
        ← Dashboard
      </Link>
      <div className="font-mono text-xs text-muted tracking-wider mb-1">DRIVER PROFILE</div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Your account.</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-paper2 flex items-center justify-center flex-shrink-0">
          {user.avatar_url
            ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
            : <span className="text-2xl font-bold">{user.name?.charAt(0)?.toUpperCase()}</span>
          }
        </div>
        <div>
          <div className="font-semibold text-lg">{user.name}</div>
          <div className="text-sm text-muted">{user.email}</div>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-white border border-black/10 rounded-2xl p-5 mb-4 space-y-3 text-sm">
        {user.phone && (
          <div className="flex justify-between">
            <span className="text-muted">Phone</span>
            <span className="font-medium">{user.phone}</span>
          </div>
        )}
        {user.bio && (
          <div>
            <span className="text-muted block mb-1">Bio</span>
            <p className="text-sm leading-relaxed">{user.bio}</p>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted">Member since</span>
          <span className="font-medium font-mono">{new Date(user.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Vehicle info */}
      <div className="bg-white border border-black/10 rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-mono text-[11px] text-muted tracking-wider">YOUR VEHICLE</div>
          <Link to="/driver/profile/edit" className="text-xs font-semibold text-muted hover:text-ink transition-colors">Edit →</Link>
        </div>
        {user.vehicle_make || user.vehicle_model ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Vehicle</span>
              <span className="font-medium">{[user.vehicle_color, user.vehicle_make, user.vehicle_model].filter(Boolean).join(' ')}</span>
            </div>
            {user.vehicle_size && (
              <div className="flex justify-between">
                <span className="text-muted">Size</span>
                <span className="font-medium capitalize">{user.vehicle_size}</span>
              </div>
            )}
            {user.license_plate && (
              <div className="flex justify-between">
                <span className="text-muted">Plate</span>
                <span className="font-medium font-mono tracking-widest">{user.license_plate}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">No vehicle added yet.</p>
            <Link to="/driver/profile/edit"
              className="text-xs font-semibold text-ink bg-lime px-3 py-1.5 rounded-full hover:bg-lime/80 transition-colors">
              Add car →
            </Link>
          </div>
        )}
      </div>

      {/* Reviews received */}
      <div className="bg-white border border-black/10 rounded-2xl p-5 mb-4">
        <div className="font-mono text-[11px] text-muted tracking-wider mb-3">REVIEWS RECEIVED</div>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted">No reviews yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {reviews.slice(0, 5).map(r => (
              <div key={r.id} className="border-b border-black/5 last:border-0 pb-3 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">{r.reviewer_name}</span>
                  <StarRating value={r.rating} size="sm" />
                </div>
                {r.comment && <p className="text-xs text-muted leading-relaxed">{r.comment}</p>}
                <div className="text-xs text-muted/60 mt-1">{new Date(r.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Link to="/driver/profile/edit"
          className="w-full py-3.5 border border-black/10 rounded-full text-sm font-semibold text-center block hover:bg-paper2 transition-colors">
          Edit profile →
        </Link>
        <Link to="/driver/settings"
          className="w-full py-3.5 border border-black/10 rounded-full text-sm font-semibold text-center block hover:bg-paper2 transition-colors text-muted">
          Settings
        </Link>
      </div>
    </div>
  )
}
