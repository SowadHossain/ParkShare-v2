import { Link } from 'react-router-dom'

const STATUS_STYLES = {
  active:    { bg: 'bg-ink text-paper', chip: 'bg-lime text-ink', label: '● Active'    },
  paid:      { bg: 'bg-white border border-black/10', chip: 'bg-paper2 text-ink', label: '● Upcoming' },
  pending:   { bg: 'bg-white border border-black/10', chip: 'bg-[#FFD4A8] text-[#5A3416]', label: '● Pending' },
  completed: { bg: 'bg-white border border-black/10', chip: 'bg-paper2 text-ink', label: 'Completed'  },
  cancelled: { bg: 'bg-white border border-black/10', chip: 'bg-[#FFEAE5] text-[#9A3310]', label: 'Cancelled' },
}

export default function BookingCard({ booking }) {
  const start = new Date(booking.start_time)
  const end   = new Date(booking.end_time)
  const fmt  = d => d.toLocaleDateString('en-BD', { month: 'short', day: 'numeric' })
  const fmtT = d => d.toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' })

  const style = STATUS_STYLES[booking.status] || STATUS_STYLES.completed
  const isDark = booking.status === 'active'

  return (
    <Link to={`/driver/bookings/${booking.id}`}
      className={`block p-4 rounded-2xl transition-all active:scale-[0.98] ${style.bg}`}
      style={isDark ? { boxShadow: '0 8px 24px rgba(0,0,0,0.14)' } : { boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold tracking-wide ${style.chip}`}>
            {style.label}
          </span>
          <div className={`font-semibold text-[15px] mt-2 leading-snug ${isDark ? 'text-paper' : ''}`}>
            {booking.spot_title}
          </div>
          <div className={`text-xs mt-1 truncate ${isDark ? 'text-paper/60' : 'text-muted'}`}>
            {booking.spot_address}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex-shrink-0 ${isDark ? 'bg-white/10' : 'bg-paper2'} flex items-center justify-center`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 17V8a3 3 0 013-3h2l1-2h2l1 2h2a3 3 0 013 3v9" stroke={isDark ? '#C8FF3D' : '#0E0E0C'} strokeWidth="1.6"/>
            <circle cx="6.5" cy="14" r="1.5" fill={isDark ? '#C8FF3D' : '#0E0E0C'}/>
            <circle cx="13.5" cy="14" r="1.5" fill={isDark ? '#C8FF3D' : '#0E0E0C'}/>
          </svg>
        </div>
      </div>
      <div className={`mt-3 pt-3 flex justify-between items-center ${isDark ? 'border-t border-white/12' : 'border-t border-black/8'}`}>
        <div className={`font-mono text-xs ${isDark ? 'text-lime' : 'text-muted'}`}>
          {fmt(start)} · {fmtT(start)} – {fmtT(end)}
        </div>
        <div className={`font-mono text-sm font-bold ${isDark ? 'text-lime' : ''}`}>
          ${parseFloat(booking.total_price).toFixed(2)}
        </div>
      </div>
    </Link>
  )
}
