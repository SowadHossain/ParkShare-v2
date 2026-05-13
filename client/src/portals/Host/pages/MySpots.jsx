import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import EmptyState from '../../../components/UI/EmptyState.jsx'

const GRADIENTS = ['from-[#5C6B4E] to-[#B8C098]','from-[#6F584A] to-[#C8B49B]','from-[#4F6A78] to-[#A8C0CB]']

export default function MySpots() {
  const { user } = useAuth()
  const [spots, setSpots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    axios.get(`${API}/spots/host/${user.id}`)
      .then(r => setSpots(r.data))
      .finally(() => setLoading(false))
  }, [user])

  return (
    <div className="p-8">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <div className="font-mono text-xs text-muted tracking-wider mb-1">MY SPOTS</div>
          <h1 className="text-3xl font-bold tracking-tight">Your listings.</h1>
        </div>
        <Link to="/host/spots/new/location"
          className="px-5 py-3 bg-lime text-ink rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
          + Add spot
        </Link>
      </div>
      {loading ? <Loader />
        : spots.length === 0
        ? <EmptyState icon="▤" title="No spots yet" message="List your driveway and start earning." action="List a spot" onAction={() => {}} />
        : <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {spots.map((s, i) => (
              <div key={s.id} className="bg-white border border-black/10 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
                <div className={`h-36 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} relative`}>
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold font-mono ${s.is_active ? 'bg-lime text-ink' : 'bg-paper2 text-muted'}`}>
                    {s.is_active ? 'Active' : 'Paused'}
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-semibold text-sm mb-1">{s.title}</div>
                  <div className="text-xs text-muted mb-3">{s.address}</div>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>★ {parseFloat(s.avg_rating || 0).toFixed(1)} · {s.booking_count} bookings</span>
                    <span className="font-mono font-bold text-ink">৳{parseFloat(s.hourly_price).toFixed(0)}/hr</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Link to={`/host/spots/${s.id}`} className="flex-1 py-2 text-center text-xs font-semibold bg-paper2 rounded-xl hover:bg-paper2/70 transition-colors">View</Link>
                    <Link to={`/host/spots/${s.id}/edit`} className="flex-1 py-2 text-center text-xs font-semibold border border-black/10 rounded-xl hover:bg-paper2 transition-colors">Edit</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  )
}
