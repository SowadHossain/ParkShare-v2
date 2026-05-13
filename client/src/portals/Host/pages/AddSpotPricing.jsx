import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Stepper from '../../../components/UI/Stepper.jsx'

const STEPS = ['Location', 'Details', 'Pricing', 'Review']
const SUGGESTED = [50, 100, 150, 200, 300, 500]

export default function AddSpotPricing() {
  const navigate = useNavigate()
  const [price, setPrice] = useState(100)

  function handleContinue(e) {
    e.preventDefault()
    const prev = JSON.parse(sessionStorage.getItem('addSpot') || '{}')
    sessionStorage.setItem('addSpot', JSON.stringify({ ...prev, hourlyPrice: price }))
    navigate('/host/spots/new/review')
  }

  const monthlyEst = (price * 8 * 20 * 0.85).toFixed(0)

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-between px-8 py-4 border-b border-black/10 bg-paper">
        <Stepper steps={STEPS} current={2} />
        <button onClick={() => navigate('/host/spots')} className="font-mono text-xs text-muted hover:text-ink tracking-wider">SAVE & EXIT</button>
      </div>
      <div className="max-w-md mx-auto px-8 py-10 w-full">
        <div className="font-mono text-xs text-muted tracking-wider mb-2">STEP 3</div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Set your price.</h1>
        <p className="text-muted text-sm leading-relaxed mb-8">Choose an hourly rate. You can change this anytime.</p>

        <form onSubmit={handleContinue} className="flex flex-col gap-6">
          <div className="text-center">
            <div className="font-mono text-6xl font-bold tracking-tight">৳{price.toFixed(0)}</div>
            <div className="text-muted text-sm mt-1">per hour</div>
          </div>

          <input type="range" min={10} max={1000} step={10}
            value={price} onChange={e => setPrice(parseFloat(e.target.value))}
            className="w-full accent-ink" />

          <div>
            <div className="font-mono text-[11px] text-muted tracking-wider mb-3">QUICK PICK</div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map(p => (
                <button key={p} type="button" onClick={() => setPrice(p)}
                  className={`px-4 py-2 rounded-xl text-sm font-mono font-semibold border transition-all ${
                    price === p ? 'bg-ink text-paper border-ink' : 'bg-white text-ink border-black/10 hover:border-black/30'
                  }`}>
                  ৳{p.toFixed(0)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-lime rounded-2xl">
            <div className="font-mono text-xs tracking-wider mb-1">ESTIMATED MONTHLY EARNINGS</div>
            <div className="font-mono text-3xl font-bold">৳{monthlyEst}</div>
            <div className="text-sm mt-1 opacity-70">Based on 8h/day · 20 days · 85% of rate (after 15% fee)</div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/host/spots/new/details')}
              className="px-5 py-3 bg-white border border-black/10 rounded-full text-sm font-semibold text-muted hover:bg-paper2 transition-colors">
              Back
            </button>
            <button type="submit"
              className="flex-1 py-3 bg-ink text-paper rounded-full text-sm font-semibold hover:bg-ink/90 transition-colors">
              Continue: Review →
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
