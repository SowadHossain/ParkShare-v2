import { Link } from 'react-router-dom'

export default function SpotRow({ spot, onDelete }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-black/10 rounded-2xl hover:shadow-sm transition-all">
      <div className="w-10 h-10 rounded-xl bg-paper2 flex items-center justify-center text-lg flex-shrink-0">
        🅿
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{spot.title}</div>
        <div className="text-xs text-muted truncate">{spot.address}</div>
        <div className="text-xs text-muted mt-0.5">Host: {spot.host_name} · ৳{parseFloat(spot.hourly_price).toFixed(0)}/hr</div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${
          spot.is_active ? 'bg-lime text-ink' : 'bg-paper2 text-muted'
        }`}>
          {spot.is_active ? 'active' : 'paused'}
        </span>
        <Link to={`/admin/spots/${spot.id}`} className="text-xs text-muted hover:text-ink px-2 py-1 rounded-lg hover:bg-black/5 transition-colors">
          View →
        </Link>
        <button onClick={() => onDelete(spot.id)} className="text-xs text-muted hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
          Delete
        </button>
      </div>
    </div>
  )
}
