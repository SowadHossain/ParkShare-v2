import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API, useAuth } from '../../../context/AuthContext.jsx'
import StatCard from '../components/StatCard.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import GreetingBanner from '../../../components/UI/GreetingBanner.jsx'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
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
    axios.get(`${API}/admin/stats`)
      .then(r => setStats(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  return (
    <div className="p-8">
      {showGreeting && <GreetingBanner name={user?.name?.split(' ')[0]} onDone={() => setShowGreeting(false)} />}
      <div className="font-mono text-xs text-muted tracking-wider mb-1">ADMIN</div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Dashboard.</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <StatCard label="TOTAL USERS" value={stats?.total_users ?? 0} sub="all roles" tone="dark" />
        <StatCard label="TOTAL SPOTS" value={stats?.total_spots ?? 0} sub="listed" />
        <StatCard label="TOTAL BOOKINGS" value={stats?.total_bookings ?? 0} sub="all time" />
        <StatCard label="REVENUE" value={`$${parseFloat(stats?.total_revenue ?? 0).toFixed(2)}`} sub="gross" tone="lime" />
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-10">
        <StatCard label="ACTIVE SPOTS" value={stats?.active_spots ?? 0} />
        <StatCard label="PENDING BOOKINGS" value={stats?.pending_bookings ?? 0} />
        <StatCard label="COMPLETED BOOKINGS" value={stats?.completed_bookings ?? 0} />
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { to: '/admin/users', icon: '👤', label: 'Manage Users', desc: 'View and remove user accounts' },
          { to: '/admin/spots', icon: '🅿', label: 'Manage Spots', desc: 'Review and remove parking spots' },
          { to: '/admin/reviews', icon: '★', label: 'Manage Reviews', desc: 'Moderate user reviews' },
          { to: '/admin/kyc', icon: '🪪', label: 'KYC Whitelist', desc: 'Manage approved NIDs & license plates' },
        ].map(({ to, icon, label, desc }) => (
          <Link key={to} to={to}
            className="flex items-start gap-4 p-5 bg-white border border-black/10 rounded-2xl hover:shadow-sm hover:border-black/20 transition-all">
            <span className="text-2xl">{icon}</span>
            <div>
              <div className="font-semibold text-sm">{label}</div>
              <div className="text-xs text-muted mt-0.5">{desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
