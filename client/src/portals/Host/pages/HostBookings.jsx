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
  { id: 'requests', label: 'Requests' },
  { id: 'all',      label: 'All'      },
  { id: 'paid',     label: 'Upcoming' },
  { id: 'active',   label: 'Active'   },
  { id: 'completed',label: 'Completed'},
  { id: 'cancelled',label: 'Cancelled'},
]

export default function HostBookings() {
  const { user } = useAuth()
  const [all, setAll] = useState([])
  const [tab, setTab] = useState('requests')
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(null)

  const reload = () => {
    if (!user) return
    axios.get(`${API}/bookings/host/${user.id}`)
      .then(r => setAll(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { reload() }, [user])

  async function handleApprove(e, bookingId) {
    e.preventDefault()
    setActing(bookingId)
    try {
      await axios.post(`${API}/bookings/${bookingId}/approve`)
      reload()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve')
    } finally {
      setActing(null)
    }
  }

  async function handleReject(e, bookingId) {
    e.preventDefault()
    setActing(bookingId)
    try {
      await axios.post(`${API}/bookings/${bookingId}/reject`)
      reload()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject')
    } finally {
      setActing(null)
    }
  }

  const pending = all.filter(b => b.status === 'pending')
  const filtered = tab === 'all' ? all
    : tab === 'requests' ? pending
    : all.filter(b => b.status === tab)

  const tabsWithCount = TABS.map(t => ({
    ...t,
    count: t.id === 'all' ? all.length
      : t.id === 'requests' ? pending.length
      : all.filter(b => b.status === t.id).length,
  }))

  return (
    <div className="p-8">
      <div className="font-mono text-xs text-muted tracking-wider mb-1">HOST BOOKINGS</div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Bookings.</h1>
      <Tabs tabs={tabsWithCount} active={tab} onChange={setTab} />
      <div className="mt-5">
        {loading ? <Loader size="sm" />
          : filtered.length === 0
          ? <EmptyState icon="◷" title={tab === 'requests' ? 'No pending requests' : 'No bookings'} message={tab === 'requests' ? 'New booking requests will appear here.' : `No ${tab} bookings.`} />
          : <div className="flex flex-col gap-2">
              {filtered.map(b => (
                tab === 'requests' ? (
                  <div key={b.id} className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{b.driver_name}</div>
                        <div className="text-xs text-muted mt-0.5">{b.spot_title}</div>
                        <div className="font-mono text-xs text-muted mt-1.5">
                          {new Date(b.start_time).toLocaleString('en-BD', { timeZone: 'Asia/Dhaka', dateStyle: 'medium', timeStyle: 'short' })} → {new Date(b.end_time).toLocaleString('en-BD', { timeZone: 'Asia/Dhaka', timeStyle: 'short' })}
                        </div>
                      </div>
                      <span className="font-mono text-sm font-bold flex-shrink-0">৳{parseFloat(b.total_price).toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={e => handleApprove(e, b.id)} disabled={acting === b.id}
                        className="flex-1 py-2 bg-ink text-paper rounded-xl text-sm font-semibold hover:bg-ink/90 disabled:opacity-50 transition-colors">
                        {acting === b.id ? '…' : 'Approve'}
                      </button>
                      <button onClick={e => handleReject(e, b.id)} disabled={acting === b.id}
                        className="flex-1 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 disabled:opacity-50 transition-colors">
                        {acting === b.id ? '…' : 'Decline'}
                      </button>
                      <Link to={`/host/bookings/${b.id}`}
                        className="px-4 py-2 bg-white border border-black/10 rounded-xl text-sm font-semibold text-muted hover:text-ink transition-colors">
                        View
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Link key={b.id} to={`/host/bookings/${b.id}`}
                    className="flex items-center gap-4 p-4 bg-white border border-black/10 rounded-2xl hover:shadow-sm hover:border-black/20 transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{b.driver_name}</div>
                      <div className="text-xs text-muted mt-0.5">{b.spot_title}</div>
                      <div className="font-mono text-xs text-muted mt-1.5">
                        {new Date(b.start_time).toLocaleString('en-BD', { timeZone: 'Asia/Dhaka', dateStyle: 'medium', timeStyle: 'short' })} → {new Date(b.end_time).toLocaleString('en-BD', { timeZone: 'Asia/Dhaka', timeStyle: 'short' })}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <StatusBadge status={b.status} />
                      <div className="font-mono text-sm font-bold">৳{parseFloat(b.total_price).toFixed(2)}</div>
                    </div>
                  </Link>
                )
              ))}
            </div>
        }
      </div>
    </div>
  )
}
