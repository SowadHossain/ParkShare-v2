import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth, API } from '../../../context/AuthContext.jsx'
import BookingCard from '../components/BookingCard.jsx'
import GreetingBanner from '../../../components/UI/GreetingBanner.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import EmptyState from '../../../components/UI/EmptyState.jsx'

export default function DriverDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings]     = useState([])
  const [loading, setLoading]       = useState(true)
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
    axios.get(`${API}/bookings/driver/${user.id}`)
      .then(res => setBookings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const active    = bookings.filter(b => b.status === 'active')
  const upcoming  = bookings.filter(b => b.status === 'paid')
  const firstName = user?.name?.split(' ')[0] || ''

  return (
    <>
      {showGreeting && (
        <GreetingBanner name={firstName} onDone={() => setShowGreeting(false)} />
      )}

      <div className="max-w-2xl mx-auto px-5 pb-8">
        {/* Header */}
        <div className="pt-8 pb-6">
          <div className="font-mono text-[11px] text-muted tracking-wider mb-1">
            HELLO, {user?.name?.toUpperCase()}
          </div>
          <h1 className="text-[32px] font-bold tracking-tight leading-tight">
            {active.length > 0 ? "You're parked." : 'Your bookings'}
          </h1>
          {active.length > 0 && (
            <p className="text-muted text-sm mt-1">Active parking session in progress.</p>
          )}
        </div>

        {/* Vehicle nudge — shown until driver adds car info */}
        {!user?.vehicle_make && (
          <Link to="/driver/profile/edit"
            className="flex items-center gap-3 p-4 bg-lime rounded-2xl mb-5 hover:bg-lime/80 active:scale-[0.98] transition-all">
            <span className="text-2xl">🚗</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">Add your vehicle</div>
              <div className="text-xs text-ink/60 mt-0.5">Make, model, and size so hosts know what to expect.</div>
            </div>
            <span className="text-ink/50 text-sm flex-shrink-0">→</span>
          </Link>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link to="/driver/search"
            className="py-[18px] bg-ink text-paper rounded-2xl font-semibold text-[15px] text-center hover:bg-ink/90 active:scale-[0.97] transition-all"
            style={{ boxShadow: '0 8px 22px rgba(14,14,12,0.18)' }}>
            Find parking →
          </Link>
          <Link to="/driver/bookings"
            className="py-[18px] bg-paper2 text-ink rounded-2xl font-semibold text-[15px] text-center hover:bg-paper2/70 active:scale-[0.97] transition-all border border-black/8">
            My trips
          </Link>
        </div>

        {/* Active booking — if any */}
        {active.length > 0 && (
          <div className="mb-6">
            <div className="font-mono text-[11px] text-muted tracking-wider mb-3">ACTIVE NOW</div>
            <div className="flex flex-col gap-2">
              {active.map(b => <BookingCard key={b.id} booking={b} />)}
            </div>
          </div>
        )}

        {/* Upcoming bookings */}
        {upcoming.length > 0 && (
          <div className="mb-6">
            <div className="font-mono text-[11px] text-muted tracking-wider mb-3">UPCOMING</div>
            <div className="flex flex-col gap-2">
              {upcoming.slice(0, 2).map(b => <BookingCard key={b.id} booking={b} />)}
            </div>
          </div>
        )}

        {/* Recent history */}
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <div className="font-mono text-[11px] text-muted tracking-wider">RECENT TRIPS</div>
            <Link to="/driver/bookings" className="text-xs font-semibold text-muted hover:text-ink">See all →</Link>
          </div>
          {loading
            ? <Loader size="sm" />
            : bookings.filter(b => b.status !== 'active' && b.status !== 'paid').length === 0
            ? <EmptyState icon="◷" title="No trips yet"
                message="Your booking history will appear here." />
            : <div className="flex flex-col gap-2">
                {bookings
                  .filter(b => b.status !== 'active' && b.status !== 'paid')
                  .slice(0, 3)
                  .map(b => <BookingCard key={b.id} booking={b} />)
                }
              </div>
          }
        </div>
      </div>
    </>
  )
}
