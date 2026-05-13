import { useEffect, useState } from 'react'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import EmptyState from '../../../components/UI/EmptyState.jsx'
import { useNavigate, Link } from 'react-router-dom'

export default function DriverNotifications() {
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${API}/notifications`)
      .then(r => setNotifs(r.data))
      .finally(() => setLoading(false))
  }, [])

  async function markRead(id) {
    await axios.patch(`${API}/notifications/${id}/read`).catch(() => {})
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <Link to="/driver/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-6">
        ← Dashboard
      </Link>
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        {notifs.some(n => !n.is_read) && (
          <button onClick={() => axios.patch(`${API}/notifications/read-all`).then(() => setNotifs(ns => ns.map(n => ({ ...n, is_read: true }))))}
            className="text-xs font-semibold text-muted hover:text-ink transition-colors">Mark all read</button>
        )}
      </div>
      {loading
        ? <Loader size="sm" />
        : notifs.length === 0
        ? <EmptyState icon="♥" title="No notifications" message="You're all caught up." />
        : <div className="flex flex-col gap-2">
            {notifs.map(n => (
              <div key={n.id}
                onClick={() => { markRead(n.id); if (n.link) navigate(n.link) }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-sm ${n.is_read ? 'bg-white border-black/10 opacity-70' : 'bg-white border-ink shadow-sm'}`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm leading-relaxed">{n.message}</p>
                  {!n.is_read && <div className="w-2 h-2 bg-lime rounded-full flex-shrink-0 mt-1.5" />}
                </div>
                <div className="font-mono text-[10px] text-muted mt-2 tracking-wider">{new Date(n.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
      }
    </div>
  )
}
