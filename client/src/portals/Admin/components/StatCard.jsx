export default function StatCard({ label, value, sub, tone = 'default' }) {
  const bg = {
    default: 'bg-white border-black/10',
    dark: 'bg-ink text-paper border-transparent',
    lime: 'bg-lime border-transparent',
  }[tone]

  const labelColor = tone === 'default' ? 'text-muted' : tone === 'dark' ? 'text-paper/60' : 'text-ink/60'
  const subColor = tone === 'default' ? 'text-muted' : tone === 'dark' ? 'text-paper/50' : 'text-ink/50'

  return (
    <div className={`rounded-2xl border p-5 ${bg}`}>
      <div className={`font-mono text-[11px] tracking-wider mb-2 ${labelColor}`}>{label}</div>
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      {sub && <div className={`text-xs mt-1 ${subColor}`}>{sub}</div>}
    </div>
  )
}
