import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SpotEditor from '../components/SpotEditor.jsx'
import Stepper from '../../../components/UI/Stepper.jsx'

const STEPS = ['Location', 'Details', 'Pricing', 'Review']

export default function AddSpotDetails() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', vehicleSize: 'sedan',
    rules: '', availableFrom: '09:00', availableTo: '17:00',
  })
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  function handleImages(e) {
    const files = Array.from(e.target.files).slice(0, 5)
    setImageFiles(files)
    setImagePreviews(files.map(f => URL.createObjectURL(f)))
  }

  function removeImage(i) {
    setImageFiles(prev => prev.filter((_, idx) => idx !== i))
    setImagePreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  function handleContinue(e) {
    e.preventDefault()
    if (!form.title) return
    const prev = JSON.parse(sessionStorage.getItem('addSpot') || '{}')
    sessionStorage.setItem('addSpot', JSON.stringify({ ...prev, ...form, imageCount: imageFiles.length }))
    // Store files in window (survive navigation within same session)
    window.__spotImages = imageFiles
    navigate('/host/spots/new/pricing')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-black/10 bg-paper">
        <Stepper steps={STEPS} current={1} />
        <button onClick={() => navigate('/host/spots')} className="font-mono text-xs text-muted hover:text-ink tracking-wider">SAVE & EXIT</button>
      </div>
      <div className="max-w-lg mx-auto px-5 md:px-8 py-10 w-full">
        <div className="font-mono text-xs text-muted tracking-wider mb-2">STEP 2</div>
        <h1 className="text-3xl font-bold tracking-tight mb-8">Tell us about it.</h1>
        <form onSubmit={handleContinue} className="flex flex-col gap-6">
          <SpotEditor form={form} onChange={setForm} />

          {/* Image upload */}
          <div>
            <label className="font-mono text-[11px] text-muted tracking-wider block mb-3">PHOTOS (optional, up to 5)</label>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-paper2">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-ink/70 text-paper rounded-full text-xs flex items-center justify-center hover:bg-ink"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="flex items-center gap-3 w-full py-3 px-4 border-2 border-dashed border-black/20 rounded-xl cursor-pointer hover:border-black/40 transition-colors">
              <span className="text-xl">📷</span>
              <span className="text-sm text-muted">
                {imagePreviews.length > 0 ? `${imagePreviews.length} photo${imagePreviews.length > 1 ? 's' : ''} selected — click to change` : 'Add photos of your parking spot'}
              </span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
            </label>
          </div>

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
