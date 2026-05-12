import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'
import BookingCard from '../components/BookingCard.jsx'
import Tabs from '../../../components/UI/Tabs.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import EmptyState from '../../../components/UI/EmptyState.jsx'
import { Link } from 'react-router-dom'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'paid', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
]

export default function BookingHistory() {
  const { user } = useAuth()
  const [all, setAll] = useState([])
  const [tab, setTab] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    axios.get(`${API}/bookings/driver/${user.id}`)
      .then(r => setAll(r.data))
      .finally(() => setLoading(false))
  }, [user])

  const filtered = tab === 'all' ? all : all.filter(b => b.status === tab)
  const tabsWithCount = TABS.map(t => ({
    ...t,
    count: t.id === 'all' ? all.length : all.filter(b => b.status === t.id).length,
  }))

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="font-mono text-xs text-muted tracking-wider mb-2">MY BOOKINGS</div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Booking history.</h1>
      <Tabs tabs={tabsWithCount} active={tab} onChange={setTab} />
      <div className="mt-5">
        {loading
          ? <Loader size="sm" />
          : filtered.length === 0
          ? <EmptyState icon="◷" title="No bookings here" message={tab === 'all' ? "You haven't made any bookings yet." : `No ${tab} bookings.`} action="Find parking" onAction={() => {}} />
          : <div className="flex flex-col gap-3">{filtered.map(b => <BookingCard key={b.id} booking={b} />)}</div>
        }
      </div>
    </div>
  )
}
