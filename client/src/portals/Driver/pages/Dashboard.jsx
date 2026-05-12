import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'
import BookingCard from '../components/BookingCard.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import EmptyState from '../../../components/UI/EmptyState.jsx'

export default function DriverDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    axios.get(`${API}/bookings/driver/${user.id}`)
      .then(res => setBookings(res.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const active = bookings.filter(b => b.status === 'active' || b.status === 'paid')

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="font-mono text-xs text-muted tracking-widest mb-2">DRIVER DASHBOARD</div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">
        {active.length > 0 ? 'You have an active booking.' : `Hey ${user?.name?.split(' ')[0] || ''}!`}
      </h1>
      <p className="text-muted text-sm mb-8">
        {active.length > 0 ? 'Check your booking details below.' : 'Ready to find parking?'}
      </p>

      <div className="flex gap-3 mb-10">
        <Link to="/driver/search" className="flex-1 py-3.5 bg-ink text-paper rounded-full font-semibold text-sm text-center hover:bg-ink/90 transition-colors">
          Find parking →
        </Link>
        <Link to="/driver/bookings" className="flex-1 py-3.5 bg-paper2 text-ink rounded-full font-semibold text-sm text-center hover:bg-paper2/70 transition-colors">
          My bookings
        </Link>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="font-semibold text-base">Recent bookings</h2>
          <Link to="/driver/bookings" className="text-xs text-muted hover:text-ink transition-colors font-semibold">See all →</Link>
        </div>
        {loading ? <Loader size="sm" /> : bookings.length === 0
          ? <EmptyState icon="◻" title="No bookings yet" message="Your bookings will appear here." action="Find a spot" onAction={() => {}} />
          : <div className="flex flex-col gap-3">{bookings.map(b => <BookingCard key={b.id} booking={b} />)}</div>
        }
      </div>
    </div>
  )
}
