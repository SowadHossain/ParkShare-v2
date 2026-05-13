import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth, API } from '../../../context/AuthContext.jsx'
import StatusBadge from '../../../components/UI/StatusBadge.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import GreetingBanner from '../../../components/UI/GreetingBanner.jsx'

const BAR_HEIGHTS = [18,32,12,40,28,52,46,38,60,34,48,72,40,58]

export default function HostDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings]         = useState([])
  const [loading, setLoading]           = useState(true)
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
  const firstName = user?.name?.split(' ')[0] || ''

  return (
    <>
      {showGreeting && <GreetingBanner name={firstName} onDone={() => setShowGreeting(false)} />}

      <div className="max-w-2xl mx-auto px-5 pb-8">
        {/* Header */}
        <div className="pt-8 pb-5 flex items-center justify-between">
          <div>
            <div className="font-mono text-[11px] text-muted tracking-wider">HOST DASHBOARD</div>
            <h1 className="text-[26px] font-bold tracking-tight mt-1">Hi {firstName}</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-paper2 flex items-center justify-center text-sm font-bold border border-black/10">
            {user?.name?.charAt(0)}
          </div>
        </div>

        {/* Earnings card — dark, matches design */}
        <div className="rounded-[22px] p-5 relative overflow-hidden mb-4"
          style={{ background: '#0E0E0C', boxShadow: '0 12px 32px rgba(0,0,0,0.18)' }}>
          {/* Lime glow blob */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full"
            style={{ background: 'rgba(200,255,61,0.18)' }} />
          <div className="font-mono text-[11px] tracking-wider" style={{ color: '#C8FF3D' }}>EARNINGS · THIS MONTH</div>
          <div className="font-mono text-[42px] font-bold mt-2 tracking-tight" style={{ color: '#F6F4EE' }}>
            ${totalEarnings.toFixed(2)}
          </div>
          <div className="text-[13px] mt-1" style={{ color: 'rgba(246,244,238,0.5)' }}>
            {bookings.filter(b => b.status === 'paid' || b.status === 'completed').length} paid bookings
          </div>
          {/* Mini bar chart */}
          <div className="flex items-end gap-1.5 h-12 mt-4">
            {BAR_HEIGHTS.map((h, i) => (
              <div key={i} className="flex-1 rounded-sm"
                style={{ height: h, background: i === BAR_HEIGHTS.length - 1 ? '#C8FF3D' : 'rgba(246,244,238,0.15)' }} />
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { l: 'BOOKINGS',  v: bookings.length,                                          s: 'all time'   },
            { l: 'TODAY',     v: today.length,                                              s: 'incoming'   },
            { l: 'ACTIVE',    v: bookings.filter(b => b.status === 'active').length,        s: 'right now'  },
            { l: 'PENDING',   v: bookings.filter(b => b.status === 'pending').length,       s: 'awaiting'   },
          ].map(s => (
            <div key={s.l} className="p-4 bg-white rounded-[18px] border border-black/10"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div className="font-mono text-[10px] text-muted tracking-wider">{s.l}</div>
              <div className="font-mono text-[26px] font-bold mt-1.5">{s.v}</div>
              <div className="text-[11px] text-muted mt-0.5">{s.s}</div>
            </div>
          ))}
        </div>

        {/* Today's bookings */}
        <div className="bg-white rounded-2xl p-5 border border-black/10"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div className="flex justify-between items-baseline mb-4">
            <h2 className="font-bold text-[15px]">
              Today
              <span className="font-mono text-xs text-muted ml-2">
                {new Date().toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}
              </span>
            </h2>
            <Link to="/host/bookings" className="text-xs text-muted hover:text-ink font-semibold">See all →</Link>
          </div>
          {loading
            ? <Loader size="sm" />
            : today.length === 0
            ? <p className="text-sm text-muted py-2">No bookings today.</p>
            : <div className="flex flex-col gap-2">
                {today.map(b => (
                  <Link key={b.id} to={`/host/bookings/${b.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-paper2 active:bg-paper2 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium truncate">{b.driver_name}</div>
                      <div className="font-mono text-xs text-muted mt-0.5">
                        {new Date(b.start_time).toLocaleTimeString('en-BD', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit' })}
                        {' → '}
                        {new Date(b.end_time).toLocaleTimeString('en-BD', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <StatusBadge status={b.status} />
                    <div className="font-mono text-sm font-bold">৳{parseFloat(b.total_price).toFixed(2)}</div>
                  </Link>
                ))}
              </div>
          }
        </div>

        {/* Add spot CTA */}
        <Link to="/host/spots/new/location"
          className="mt-4 flex items-center justify-center h-[60px] rounded-[18px] font-semibold text-[15px] text-ink"
          style={{ background: '#C8FF3D', boxShadow: '0 8px 22px rgba(200,255,61,0.4)' }}>
          + Add a new spot
        </Link>
      </div>
    </>
  )
}
