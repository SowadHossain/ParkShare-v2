import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import SpotEditor from '../components/SpotEditor.jsx'
import Loader from '../../../components/UI/Loader.jsx'

export default function EditSpot() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`${API}/spots/${id}`).then(r => {
      const s = r.data
      setForm({
        title: s.title, description: s.description || '',
        vehicleSize: s.vehicle_size, rules: s.rules || '',
        availableFrom: s.available_from || '', availableTo: s.available_to || '',
      })
    }).finally(() => setLoading(false))
  }, [id])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await axios.put(`${API}/spots/${id}`, {
        title: form.title, description: form.description,
        vehicle_size: form.vehicleSize, rules: form.rules,
        available_from: form.availableFrom || null, available_to: form.availableTo || null,
      })
      navigate(`/host/spots/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="max-w-lg mx-auto p-8">
      <button onClick={() => navigate(`/host/spots/${id}`)} className="text-sm text-muted hover:text-ink mb-6 block">← Back to spot</button>
      <div className="font-mono text-xs text-muted tracking-wider mb-2">EDIT SPOT</div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Update listing.</h1>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <SpotEditor form={form} onChange={setForm} />
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate(`/host/spots/${id}`)}
            className="px-5 py-3 bg-white border border-black/10 rounded-full text-sm font-semibold text-muted hover:bg-paper2 transition-colors">Cancel</button>
          <button type="submit" disabled={saving}
            className="flex-1 py-3 bg-ink text-paper rounded-full text-sm font-semibold hover:bg-ink/90 disabled:opacity-50 transition-colors">
            {saving ? 'Saving…' : 'Save changes →'}
          </button>
        </div>
      </form>
    </div>
  )
}
