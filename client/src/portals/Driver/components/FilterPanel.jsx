export default function FilterPanel({ filters, onChange }) {
  const set = (key, val) => onChange({ ...filters, [key]: val })

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="font-mono text-[11px] text-muted tracking-wider block mb-2">MAX PRICE / HR</label>
        <div className="font-mono text-2xl font-bold">${filters.maxPrice || 10}</div>
        <input type="range" min={1} max={10} step={0.5}
          value={filters.maxPrice || 10}
          onChange={e => set('maxPrice', parseFloat(e.target.value))}
          className="w-full mt-2 accent-ink" />
        <div className="flex justify-between font-mono text-[10px] text-muted mt-1">
          <span>$1</span><span>$10+</span>
        </div>
      </div>

      <div>
        <label className="font-mono text-[11px] text-muted tracking-wider block mb-2">VEHICLE SIZE</label>
        <div className="flex flex-wrap gap-2">
          {['any', 'sedan', 'suv', 'van', 'truck'].map(v => (
            <button key={v} type="button"
              onClick={() => set('vehicleSize', v === 'any' ? '' : v)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${
                (filters.vehicleSize === v || (!filters.vehicleSize && v === 'any'))
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-white text-ink border-black/10 hover:border-black/30'
              }`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="font-mono text-[11px] text-muted tracking-wider block mb-2">MIN RATING</label>
        <div className="flex gap-2">
          {[0, 3, 4, 5].map(r => (
            <button key={r} type="button"
              onClick={() => set('minRating', r)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                filters.minRating === r
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-white text-ink border-black/10 hover:border-black/30'
              }`}>
              {r === 0 ? 'Any' : `${r}★+`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
