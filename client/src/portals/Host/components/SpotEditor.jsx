export default function SpotEditor({ form, onChange }) {
  const set = (k, v) => onChange({ ...form, [k]: v })

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="font-mono text-[11px] text-muted tracking-wider">TITLE</label>
        <input type="text" required value={form.title || ''} onChange={e => set('title', e.target.value)}
          placeholder="e.g. Cozy driveway by the lake"
          className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20" />
      </div>
      <div>
        <label className="font-mono text-[11px] text-muted tracking-wider">DESCRIPTION</label>
        <textarea rows={3} value={form.description || ''} onChange={e => set('description', e.target.value)}
          placeholder="Describe your spot for drivers…"
          className="mt-1.5 w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 resize-none" />
      </div>
      <div>
        <label className="font-mono text-[11px] text-muted tracking-wider">VEHICLE SIZE</label>
        <div className="flex gap-2 mt-1.5">
          {['sedan', 'suv', 'van', 'truck'].map(v => (
            <button key={v} type="button" onClick={() => set('vehicleSize', v)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all capitalize ${
                form.vehicleSize === v ? 'bg-ink text-paper border-ink' : 'bg-white text-ink border-black/10 hover:border-black/30'
              }`}>
              {v}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="font-mono text-[11px] text-muted tracking-wider">HOUSE RULES</label>
        <textarea rows={3} value={form.rules || ''} onChange={e => set('rules', e.target.value)}
          placeholder="e.g. No oversized trucks. Quiet hours after 9 PM."
          className="mt-1.5 w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-mono text-[11px] text-muted tracking-wider">AVAILABLE FROM</label>
          <input type="time" value={form.availableFrom || ''} onChange={e => set('availableFrom', e.target.value)}
            className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20" />
        </div>
        <div>
          <label className="font-mono text-[11px] text-muted tracking-wider">AVAILABLE TO</label>
          <input type="time" value={form.availableTo || ''} onChange={e => set('availableTo', e.target.value)}
            className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20" />
        </div>
      </div>
    </div>
  )
}
