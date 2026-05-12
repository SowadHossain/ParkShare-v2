import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SpotEditor from '../components/SpotEditor.jsx'
import Stepper from '../../../components/UI/Stepper.jsx'

const STEPS = ['Location', 'Details', 'Pricing', 'Review']

export default function AddSpotDetails() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', vehicleSize: 'sedan', rules: '', availableFrom: '09:00', availableTo: '17:00' })

  function handleContinue(e) {
    e.preventDefault()
    if (!form.title) return
    const prev = JSON.parse(sessionStorage.getItem('addSpot') || '{}')
    sessionStorage.setItem('addSpot', JSON.stringify({ ...prev, ...form }))
    navigate('/host/spots/new/pricing')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-between px-8 py-4 border-b border-black/10 bg-paper">
        <Stepper steps={STEPS} current={1} />
        <button onClick={() => navigate('/host/spots')} className="font-mono text-xs text-muted hover:text-ink tracking-wider">SAVE & EXIT</button>
      </div>
      <div className="max-w-lg mx-auto px-8 py-10 w-full">
        <div className="font-mono text-xs text-muted tracking-wider mb-2">STEP 2</div>
        <h1 className="text-3xl font-bold tracking-tight mb-8">Tell us about it.</h1>
        <form onSubmit={handleContinue} className="flex flex-col gap-6">
          <SpotEditor form={form} onChange={setForm} />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/host/spots/new/location')}
              className="px-5 py-3 bg-white border border-black/10 rounded-full text-sm font-semibold text-muted hover:bg-paper2 transition-colors">
              Back
            </button>
            <button type="submit"
              className="flex-1 py-3 bg-ink text-paper rounded-full text-sm font-semibold hover:bg-ink/90 transition-colors">
              Continue: Pricing →
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
