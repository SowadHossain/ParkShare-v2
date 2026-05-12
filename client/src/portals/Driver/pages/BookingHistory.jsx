import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth, API } from '../../../context/AuthContext.jsx'
import BookingCard from '../components/BookingCard.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import EmptyState from '../../../components/UI/EmptyState.jsx'
import { useNavigate } from 'react-router-dom'

const TABS = [
  { id: 'active',    label: 'Active'    },
  { id: 'paid',      label: 'Upcoming'  },
  { id: 'completed', label: 'Past'      },
  { id: 'cancelled', label: 'Cancelled' },
]

export default function BookingHistory() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [all, setAll]       = useState([])
  const [tab, setTab]       = useState('active')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    axios.get(`${API}/bookings/driver/${user.id}`)
      .then(r => setAll(r.data))
      .finally(() => setLoading(false))
  }, [user])

  const filtered = all.filter(b => b.status === tab)

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      {/* Header */}
      <div className="font-mono text-xs text-muted tracking-wider mb-1">YOUR BOOKINGS</div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Trips</h1>

      {/* Tabs — design style: underline with count badge */}
      <div className="flex gap-0 border-b border-black/10 mb-5 -mx-1">
        {TABS.map(t => {
          const count = all.filter(b => b.status === t.id).length
          const isActive = tab === t.id
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`relative px-3 py-2.5 text-[13px] font-semibold transition-colors ${isActive ? 'text-ink' : 'text-muted'}`}
              style={{ borderBottom: isActive ? '2px solid #0E0E0C' : '2px solid transparent', marginBottom: -1 }}>
              {t.label}
              {count > 0 && (
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-ink text-lime' : 'bg-paper2 text-muted'
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {loading
        ? <Loader size="sm" />
        : filtered.length === 0
        ? <EmptyState icon="◷" title={`No ${TABS.find(t=>t.id===tab)?.label.toLowerCase()} bookings`}
            message={tab === 'active' ? 'No active bookings right now.' : `You have no ${tab} bookings.`}
            action="Find parking" onAction={() => navigate('/driver/search')} />
        : <div className="flex flex-col gap-3">
            {filtered.map(b => <BookingCard key={b.id} booking={b} />)}
          </div>
      }
    </div>
  )
}
