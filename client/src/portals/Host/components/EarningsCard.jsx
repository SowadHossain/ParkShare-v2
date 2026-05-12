export default function EarningsCard({ label, value, sub, tone = 'default' }) {
  const tones = {
    default: 'bg-white border border-black/10',
    dark: 'bg-ink text-paper border-0',
    lime: 'bg-lime text-ink border-0',
  }
  const subColor = {
    default: 'text-muted',
    dark: 'text-paper/50',
    lime: 'text-ink/60',
  }
  const labelColor = {
    default: 'text-muted',
    dark: 'text-lime',
    lime: 'text-ink/70',
  }
  return (
    <div className={`p-5 rounded-2xl ${tones[tone]}`}>
      <div className={`font-mono text-[10px] tracking-wider uppercase ${labelColor[tone]}`}>{label}</div>
      <div className={`font-mono text-3xl font-bold mt-2 tracking-tight ${tone === 'default' ? 'text-ink' : ''}`}>{value}</div>
      {sub && <div className={`text-xs mt-1.5 ${subColor[tone]}`}>{sub}</div>}
    </div>
  )
}
