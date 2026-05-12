export default function Calendar({ bookings = [] }) {
  const today = new Date()
  const month = today.getMonth()
  const year = today.getFullYear()
  const days = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const bookedDays = new Set(bookings
    .filter(b => ['paid','active','completed'].includes(b.status))
    .map(b => new Date(b.start_time).getDate())
  )

  return (
    <div className="p-4 bg-white border border-black/10 rounded-2xl">
      <div className="font-mono text-xs text-muted tracking-wider mb-3 uppercase">
        {today.toLocaleString('default', { month: 'long' })} {year}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="font-mono text-[10px] text-muted py-1">{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: days }, (_, i) => i + 1).map(d => (
          <div key={d} className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
            d === today.getDate() ? 'bg-ink text-paper' :
            bookedDays.has(d) ? 'bg-lime text-ink' : 'text-ink hover:bg-paper2'
          }`}>{d}</div>
        ))}
      </div>
      <div className="flex gap-3 mt-3 text-xs text-muted">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-lime rounded" />Booked</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-ink rounded" />Today</span>
      </div>
    </div>
  )
}
