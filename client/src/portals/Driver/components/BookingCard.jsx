import { Link } from 'react-router-dom'
import StatusBadge from '../../../components/UI/StatusBadge.jsx'

export default function BookingCard({ booking }) {
  const start = new Date(booking.start_time)
  const end = new Date(booking.end_time)
  const fmt = d => d.toLocaleDateString('en-BD', { month: 'short', day: 'numeric' })
  const fmtT = d => d.toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' })

  return (
    <Link to={`/driver/bookings/${booking.id}`}
      className="flex items-center gap-4 p-4 bg-white border border-black/10 rounded-2xl hover:shadow-sm hover:border-black/20 transition-all">
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{booking.spot_title}</div>
        <div className="text-xs text-muted mt-1 truncate">{booking.spot_address}</div>
        <div className="font-mono text-xs text-muted mt-2">
          {fmt(start)} · {fmtT(start)} → {fmtT(end)}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <StatusBadge status={booking.status} />
        <div className="font-mono text-sm font-bold">${parseFloat(booking.total_price).toFixed(2)}</div>
      </div>
    </Link>
  )
}
