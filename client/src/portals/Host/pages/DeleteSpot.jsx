import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import Loader from '../../../components/UI/Loader.jsx'

export default function DeleteSpot() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [spot, setSpot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`${API}/spots/${id}`).then(r => setSpot(r.data)).finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    setDeleting(true)
    try {
      await axios.delete(`${API}/spots/${id}`)
      navigate('/host/spots')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete')
      setDeleting(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8 text-2xl">⚠</div>
      <div className="font-mono text-xs text-muted tracking-wider mb-3">DELETE LISTING</div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Delete this spot?</h1>
      {spot && (
        <p className="text-muted text-sm mb-8 leading-relaxed">
          You're about to permanently delete <strong>{spot.title}</strong>. All associated data will be removed. This cannot be undone.
        </p>
      )}
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
      <div className="flex flex-col gap-3">
        <button onClick={handleDelete} disabled={deleting}
          className="w-full py-4 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors">
          {deleting ? 'Deleting…' : 'Yes, delete permanently'}
        </button>
        <Link to={`/host/spots/${id}`} className="text-sm text-muted hover:text-ink transition-colors">Keep this spot</Link>
      </div>
    </div>
  )
}
