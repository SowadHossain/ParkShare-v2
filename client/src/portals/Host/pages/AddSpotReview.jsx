import { useNavigate } from 'react-router-dom'
import { API } from '../../../context/AuthContext.jsx'
import { useState } from 'react'
import axios from 'axios'
import Stepper from '../../../components/UI/Stepper.jsx'

const STEPS = ['Location', 'Details', 'Pricing', 'Review']

export default function AddSpotReview() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const data = JSON.parse(sessionStorage.getItem('addSpot') || '{}')

  async function handlePublish() {
    setLoading(true)
    setError('')
    try {
      await axios.post(`${API}/spots`, {
        title: data.title,
        description: data.description,
        address: data.address || 'TBD',
        latitude: data.lat || 23.7937,
        longitude: data.lng || 90.4066,
        hourlyPrice: data.hourlyPrice || 3.00,
        vehicleSize: data.vehicleSize || 'sedan',
        rules: data.rules || '',
        availableFrom: data.availableFrom || null,
        availableTo: data.availableTo || null,
      })
      sessionStorage.removeItem('addSpot')
      navigate('/host/spots/new/published')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-between px-8 py-4 border-b border-black/10 bg-paper">
        <Stepper steps={STEPS} current={3} />
        <button onClick={() => navigate('/host/spots')} className="font-mono text-xs text-muted hover:text-ink tracking-wider">SAVE & EXIT</button>
      </div>
      <div className="max-w-md mx-auto px-8 py-10 w-full">
        <div className="font-mono text-xs text-muted tracking-wider mb-2">STEP 4 · FINAL REVIEW</div>
        <h1 className="text-3xl font-bold tracking-tight mb-8">Looks good?</h1>
        <div className="bg-white border border-black/10 rounded-2xl p-5 mb-6 space-y-3 text-sm">
          {[
            ['Title', data.title || '—'],
            ['Address', data.address || '—'],
            ['Vehicle', data.vehicleSize || 'sedan'],
            ['Price', `$${parseFloat(data.hourlyPrice || 3).toFixed(2)}/hr`],
            ['Available', data.availableFrom ? `${data.availableFrom} – ${data.availableTo}` : 'Not set'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-muted">{k}</span>
              <span className="font-medium">{v}</span>
            </div>
          ))}
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
        <div className="flex gap-3">
          <button onClick={() => navigate('/host/spots/new/pricing')}
            className="px-5 py-3 bg-white border border-black/10 rounded-full text-sm font-semibold text-muted hover:bg-paper2 transition-colors">Back</button>
          <button onClick={handlePublish} disabled={loading}
            className="flex-1 py-3 bg-lime text-ink rounded-full text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity">
            {loading ? 'Publishing…' : 'Publish listing →'}
          </button>
        </div>
      </div>
    </div>
  )
}
