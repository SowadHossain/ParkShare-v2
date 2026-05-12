import { useEffect, useState } from 'react'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import UserRow from '../components/UserRow.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import EmptyState from '../../../components/UI/EmptyState.jsx'
import ConfirmDialog from '../../../components/UI/ConfirmDialog.jsx'

export default function ModerationUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams()
    if (role !== 'all') params.set('role', role)
    if (search) params.set('search', search)
    axios.get(`${API}/users?${params}`)
      .then(r => setUsers(r.data))
      .finally(() => setLoading(false))
  }, [role, search])

  async function handleDelete() {
    await axios.delete(`${API}/users/${deleteId}`)
    setUsers(prev => prev.filter(u => u.id !== deleteId))
    setDeleteId(null)
  }

  const filtered = search
    ? users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    : users

  return (
    <div className="p-8">
      <div className="font-mono text-xs text-muted tracking-wider mb-1">ADMIN · USERS</div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Users.</h1>

      <div className="flex items-center gap-3 mb-6">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
          className="flex-1 max-w-sm px-4 py-2.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20" />
        <div className="flex gap-1">
          {['all', 'driver', 'host', 'admin'].map(r => (
            <button key={r} onClick={() => setRole(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                role === r ? 'bg-ink text-paper' : 'bg-white border border-black/10 text-muted hover:text-ink'
              }`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Loader size="sm" />
        : filtered.length === 0
        ? <EmptyState icon="👤" title="No users found" message="Try a different search or filter." />
        : (
          <div className="flex flex-col gap-2">
            {filtered.map(u => <UserRow key={u.id} user={u} onDelete={setDeleteId} />)}
          </div>
        )
      }

      <ConfirmDialog
        open={!!deleteId}
        title="Delete user?"
        message="This will permanently delete the user account. This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
