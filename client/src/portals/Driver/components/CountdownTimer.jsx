import { useState, useEffect } from 'react'

export default function CountdownTimer({ endTime }) {
  const [remaining, setRemaining] = useState(getRem())

  function getRem() {
    const diff = new Date(endTime) - Date.now()
    if (diff <= 0) return null
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    return { h, m, s, total: diff }
  }

  useEffect(() => {
    const t = setInterval(() => setRemaining(getRem()), 1000)
    return () => clearInterval(t)
  }, [endTime])

  if (!remaining) return (
    <div className="p-4 bg-paper2 rounded-2xl text-center">
      <div className="font-mono text-sm text-muted">Session ended</div>
    </div>
  )

  const pad = n => String(n).padStart(2, '0')

  return (
    <div className="p-4 bg-ink text-paper rounded-2xl text-center">
      <div className="font-mono text-[11px] text-lime tracking-widest mb-2">TIME REMAINING</div>
      <div className="font-mono text-4xl font-bold tracking-tight">
        {pad(remaining.h)}:{pad(remaining.m)}:{pad(remaining.s)}
      </div>
    </div>
  )
}
