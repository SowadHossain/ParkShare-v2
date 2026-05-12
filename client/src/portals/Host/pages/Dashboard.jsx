import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'
import StatusBadge from '../../../components/UI/StatusBadge.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import GreetingBanner from '../../../components/UI/GreetingBanner.jsx'

export default function HostDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showGreeting, setShowGreeting] = useState(false)

  useEffect(() => {
    const key = `greeted_${user?.id}`
    if (user && !sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1')
      setShowGreeting(true)
    }
  }, [user?.id])

  useEffect(() => {
    if (!user) return
    axios.get(`${API}/bookings/host/${user.id}`)
      .then(r => setBookings(r.data))
      .finally(() => setLoading(false))
  }, [user])

  const today = bookings.filter(b => {
    const d = new Date(b.start_time)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  })
  const totalEarnings = bookings
    .filter(b => b.status === 'paid' || b.status === 'completed')
    .reduce((s, b) => s + parseFloat(b.total_price), 0)

  return (
    <div className="p-8">
      {showGreeting && <GreetingBanner name={user?.name?.split(' ')[0]} onDone={() => setShowGreeting(false)} />}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="font-mono text-xs text-muted tracking-wider mb-1">
            GOOD {new Date().getHours() < 12 ? 'MORNING' : 'AFTERNOON'} · {user?.name?.toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Your host dashboard.</h1>
        </div>
        <Link to="/host/spots/new/location"
          className="px-5 py-3 bg-lime text-ink rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
          + Add spot
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { l: 'TOTAL EARNINGS', v: `$${totalEarnings.toFixed(2)}`, d: 'lifetime', tone: 'dark' },
          { l: 'TOTAL BOOKINGS', v: bookings.length, d: 'all time', tone: 'default' },
          { l: "TODAY'S BOOKINGS", v: today.length, d: 'scheduled', tone: 'default' },
          { l: 'ACTIVE', v: bookings.filter(b => b.status === 'active').length, d: 'right now', tone: 'default' },
        ].map((s, i) => (
          <div key={s.l} className={`p-5 rounded-2xl ${s.tone === 'dark' ? 'bg-ink text-paper' : 'bg-white border border-black/10'}`}>
            <div className={`font-mono text-[10px] tracking-wider ${s.tone === 'dark' ? 'text-lime' : 'text-muted'}`}>{s.l}</div>
            <div className={`font-mono text-3xl font-bold mt-2 ${s.tone === 'dark' ? '' : 'text-ink'}`}>{s.v}</div>
            <div className={`text-xs mt-1 ${s.tone === 'dark' ? 'text-paper/50' : 'text-muted'}`}>{s.d}</div>
          </div>
        ))}
      </div>

      {/* Today's bookings */}
      <div className="bg-white border border-black/10 rounded-2xl p-5">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="font-bold text-base">
            Today's bookings
            <span className="font-mono text-xs text-muted ml-2">{new Date().toLocaleDateString()}</span>
          </h2>
          <Link to="/host/bookings" className="text-xs text-muted hover:text-ink font-semibold">See all →</Link>
        </div>
        {loading ? <Loader size="sm" />
          : today.length === 0
          ? <p className="text-sm text-muted py-4">No bookings today.</p>
          : <div className="flex flex-col gap-2">
              {today.map(b => (
                <Link key={b.id} to={`/host/bookings/${b.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-paper2 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{b.driver_name}</div>
                    <div className="font-mono text-xs text-muted mt-0.5">
                      {new Date(b.start_time).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} → {new Date(b.end_time).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
                    </div>
                  </div>
                  <StatusBadge status={b.status} />
                  <div className="font-mono text-sm font-bold">${parseFloat(b.total_price).toFixed(2)}</div>
                </Link>
              ))}
            </div>
        }
      </div>
    </div>
  )
}
