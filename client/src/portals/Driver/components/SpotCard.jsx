import { Link } from 'react-router-dom'

const GRADIENTS = [
  'from-[#5C6B4E] to-[#B8C098]',
  'from-[#6F584A] to-[#C8B49B]',
  'from-[#4F6A78] to-[#A8C0CB]',
  'from-[#705D4A] to-[#C8B8A0]',
  'from-[#5A7066] to-[#9DB5AB]',
]

export default function SpotCard({ spot, index = 0, highlighted = false }) {
  const dist = spot.distance_m
    ? spot.distance_m < 1000
      ? `${Math.round(spot.distance_m)} m`
      : `${(spot.distance_m / 1000).toFixed(1)} km`
    : null

  return (
    <Link to={`/driver/spots/${spot.id}`}
      className={`flex gap-3 p-3.5 rounded-2xl border transition-all hover:shadow-md ${highlighted ? 'border-ink bg-paper shadow-sm' : 'border-black/10 bg-white hover:border-black/20'}`}>
      <div className="w-24 h-24 rounded-xl flex-shrink-0 overflow-hidden bg-paper2">
        {spot.images?.[0]
          ? <img src={spot.images[0]} alt="" className="w-full h-full object-cover" />
          : <div className={`w-full h-full bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]}`} />
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="text-sm font-semibold leading-snug">{spot.title}</div>
          <div className="text-right flex-shrink-0">
            <div className="font-mono text-lg font-bold">${parseFloat(spot.hourly_price).toFixed(2)}</div>
            <div className="text-[10px] text-muted">/ hr</div>
          </div>
        </div>
        <div className="text-xs text-muted mt-1 truncate">{spot.address}</div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {spot.vehicle_size && (
            <span className="px-2 py-0.5 bg-paper2 rounded-full text-[10px] font-mono font-semibold uppercase">{spot.vehicle_size}</span>
          )}
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-muted">
          <span>★ {parseFloat(spot.avg_rating || 0).toFixed(1)} · {spot.host_name}</span>
          {dist && <span className="font-mono">{dist}</span>}
        </div>
      </div>
    </Link>
  )
}
