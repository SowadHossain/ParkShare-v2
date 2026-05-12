import { useEffect, useState } from 'react'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import SpotRow from '../components/SpotRow.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import EmptyState from '../../../components/UI/EmptyState.jsx'
import ConfirmDialog from '../../../components/UI/ConfirmDialog.jsx'

export default function ModerationSpots() {
  const [spots, setSpots] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    axios.get(`${API}/spots`)
      .then(r => setSpots(r.data))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete() {
    await axios.delete(`${API}/spots/${deleteId}`)
    setSpots(prev => prev.filter(s => s.id !== deleteId))
    setDeleteId(null)
  }

  const filtered = search
    ? spots.filter(s =>
        s.title?.toLowerCase().includes(search.toLowerCase()) ||
        s.address?.toLowerCase().includes(search.toLowerCase()) ||
        s.host_name?.toLowerCase().includes(search.toLowerCase())
      )
    : spots

  return (
    <div className="p-8">
      <div className="font-mono text-xs text-muted tracking-wider mb-1">ADMIN · SPOTS</div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Spots.</h1>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title, address or host…"
        className="w-full max-w-sm px-4 py-2.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 mb-6" />

      {loading ? <Loader size="sm" />
        : filtered.length === 0
        ? <EmptyState icon="🅿" title="No spots found" message="No parking spots match your search." />
        : (
          <div className="flex flex-col gap-2">
            {filtered.map(s => <SpotRow key={s.id} spot={s} onDelete={setDeleteId} />)}
          </div>
        )
      }

      <ConfirmDialog
        open={!!deleteId}
        title="Delete spot?"
        message="This will permanently delete the parking spot and all associated bookings. This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
