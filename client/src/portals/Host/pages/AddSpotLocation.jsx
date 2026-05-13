import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LocationPicker from '../components/LocationPicker.jsx'
import Stepper from '../../../components/UI/Stepper.jsx'

const STEPS = ['Location', 'Details', 'Pricing', 'Review']

export default function AddSpotLocation() {
  const navigate = useNavigate()
  const [loc, setLoc] = useState({ lat: null, lng: null, address: '' })

  function handleContinue() {
    if (!loc.lat || !loc.lng) return
    sessionStorage.setItem('addSpot', JSON.stringify({ ...loc }))
    navigate('/host/spots/new/details')
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-black/10 bg-paper flex-shrink-0">
        <Stepper steps={STEPS} current={0} />
        <button onClick={() => navigate('/host/spots')} className="font-mono text-xs text-muted hover:text-ink tracking-wider">EXIT</button>
      </div>

      {/* Mobile: map on top, form below  |  Desktop: form left, map right */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

        {/* Map — full width on mobile (top half), fills remaining on desktop */}
        <div className="relative h-[48vh] flex-shrink-0 md:h-auto md:flex-1 md:order-2">
          <LocationPicker lat={loc.lat} lng={loc.lng} onChange={({ lat, lng }) => setLoc(l => ({ ...l, lat, lng }))} />
          {!loc.lat && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-ink/90 text-paper px-4 py-2 rounded-xl font-mono text-xs tracking-wider">TAP MAP TO DROP PIN</div>
            </div>
          )}
        </div>

        {/* Form panel — scrollable bottom sheet on mobile, fixed sidebar on desktop */}
        <div className="md:order-1 md:w-80 md:flex-shrink-0 flex-1 overflow-y-auto flex flex-col p-5 md:p-8 border-t md:border-t-0 md:border-r border-black/10 bg-paper">
          <div className="font-mono text-xs text-muted tracking-wider mb-2">STEP 1</div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Where is your driveway?</h1>
          <p className="text-muted text-sm leading-relaxed mb-5">
            Tap the map to drop a pin. Drivers see this exact spot after booking.
          </p>

          <div>
            <label className="font-mono text-[11px] text-muted tracking-wider">ADDRESS</label>
            <input type="text" value={loc.address} onChange={e => setLoc(l => ({ ...l, address: e.target.value }))}
              placeholder="Road 113, Gulshan 2, Dhaka"
              className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20" />
          </div>

          {loc.lat && loc.lng && (
            <div className="mt-3 p-3 bg-paper2 rounded-xl text-xs font-mono">
              <div className="text-muted mb-1">PIN DROPPED ✓</div>
              <div>{loc.lat.toFixed(5)}° N, {loc.lng.toFixed(5)}° E</div>
            </div>
          )}

          <div className="mt-3 p-3 bg-lime rounded-xl text-sm leading-relaxed">
            <strong>Tip:</strong> Pin where drivers should park — not your front door.
          </div>

          <div className="mt-4 flex gap-3 pb-2">
            <button onClick={() => navigate('/host/spots')}
              className="px-5 py-3 bg-white border border-black/10 rounded-full text-sm font-semibold text-muted hover:bg-paper2 transition-colors">
              Back
            </button>
            <button onClick={handleContinue} disabled={!loc.lat || !loc.lng}
              className="flex-1 py-3 bg-ink text-paper rounded-full text-sm font-semibold hover:bg-ink/90 disabled:opacity-40 transition-colors">
              Continue: Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
