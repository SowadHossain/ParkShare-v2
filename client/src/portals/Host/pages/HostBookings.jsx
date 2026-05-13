import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'
import StatusBadge from '../../../components/UI/StatusBadge.jsx'
import Tabs from '../../../components/UI/Tabs.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import EmptyState from '../../../components/UI/EmptyState.jsx'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'paid', label: 'Upcoming' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
]

export default function HostBookings() {
  const { user } = useAuth()
  const [all, setAll] = useState([])
  const [tab, setTab] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    axios.get(`${API}/bookings/host/${user.id}`)
      .then(r => setAll(r.data))
      .finally(() => setLoading(false))
  }, [user])

  const filtered = tab === 'all' ? all : all.filter(b => b.status === tab)
  const tabsWithCount = TABS.map(t => ({
    ...t,
    count: t.id === 'all' ? all.length : all.filter(b => b.status === t.id).length,
  }))

  return (
    <div className="p-8">
      <div className="font-mono text-xs text-muted tracking-wider mb-1">HOST BOOKINGS</div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Bookings.</h1>
      <Tabs tabs={tabsWithCount} active={tab} onChange={setTab} />
      <div className="mt-5">
        {loading ? <Loader size="sm" />
          : filtered.length === 0
          ? <EmptyState icon="◷" title="No bookings" message={tab === 'all' ? 'No bookings yet.' : `No ${tab} bookings.`} />
          : <div className="flex flex-col gap-2">
              {filtered.map(b => (
                <Link key={b.id} to={`/host/bookings/${b.id}`}
                  className="flex items-center gap-4 p-4 bg-white border border-black/10 rounded-2xl hover:shadow-sm hover:border-black/20 transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{b.driver_name}</div>
                    <div className="text-xs text-muted mt-0.5">{b.spot_title}</div>
                    <div className="font-mono text-xs text-muted mt-1.5">
                      {new Date(b.start_time).toLocaleString()} → {new Date(b.end_time).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <StatusBadge status={b.status} />
                    <div className="font-mono text-sm font-bold">৳{parseFloat(b.total_price).toFixed(2)}</div>
                  </div>
                </Link>
              ))}
            </div>
        }
      </div>
    </div>
  )
}
