import { useEffect, useState } from 'react'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import EmptyState from '../../../components/UI/EmptyState.jsx'

export default function HostNotifications() {
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/notifications`)
      .then(r => setNotifs(r.data))
      .finally(() => setLoading(false))
  }, [])

  async function markRead(id) {
    await axios.patch(`${API}/notifications/${id}/read`)
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  async function markAllRead() {
    await axios.patch(`${API}/notifications/read-all`)
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  async function remove(id) {
    await axios.delete(`${API}/notifications/${id}`)
    setNotifs(prev => prev.filter(n => n.id !== id))
  }

  const unread = notifs.filter(n => !n.is_read).length

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <div className="font-mono text-xs text-muted tracking-wider mb-1">NOTIFICATIONS</div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox.</h1>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm text-muted hover:text-ink underline underline-offset-2">
            Mark all read
          </button>
        )}
      </div>

      {loading ? <Loader size="sm" /> : notifs.length === 0
        ? <EmptyState icon="🔔" title="All caught up" message="No notifications yet." />
        : (
          <div className="flex flex-col gap-2">
            {notifs.map(n => (
              <div key={n.id}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${n.is_read ? 'bg-white border-black/10' : 'bg-lime/10 border-lime/30'}`}>
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.is_read ? 'bg-transparent' : 'bg-lime'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-muted mt-1">{new Date(n.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!n.is_read && (
                    <button onClick={() => markRead(n.id)} className="text-xs text-muted hover:text-ink px-2 py-1 rounded-lg hover:bg-black/5 transition-colors">
                      Read
                    </button>
                  )}
                  <button onClick={() => remove(n.id)} className="text-xs text-muted hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}
