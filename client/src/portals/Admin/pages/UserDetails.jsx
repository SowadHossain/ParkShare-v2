import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import StatusBadge from '../../../components/UI/StatusBadge.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import ConfirmDialog from '../../../components/UI/ConfirmDialog.jsx'

export default function AdminUserDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/users/${id}`),
      axios.get(`${API}/bookings/driver/${id}`).catch(() => ({ data: [] })),
    ]).then(([ur, br]) => {
      setUser(ur.data)
      setBookings(br.data)
    }).finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    await axios.delete(`${API}/users/${id}`)
    navigate('/admin/users')
  }

  if (loading) return <Loader />
  if (!user) return <div className="p-10 text-center text-muted">User not found.</div>

  const fields = [
    ['Email', user.email],
    ['Phone', user.phone || 'Not set'],
    ['Role', user.role],
    ['Onboarded', user.is_onboarded ? 'Yes' : 'No'],
    ['Google OAuth', user.google_id ? 'Yes' : 'No'],
    ['Joined', new Date(user.created_at).toLocaleDateString()],
  ]

  return (
    <div className="p-8 max-w-2xl">
      <Link to="/admin/users" className="text-sm text-muted hover:text-ink mb-6 block">← All users</Link>

      <div className="flex items-center gap-5 mb-6">
        <div className="w-14 h-14 rounded-full bg-ink text-paper flex items-center justify-center text-xl font-bold">
          {user.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
          <div className="text-sm text-muted">{user.email}</div>
        </div>
      </div>

      <div className="bg-white border border-black/10 rounded-2xl p-5 space-y-3 text-sm mb-6">
        {fields.map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-muted">{k}</span>
            <span className="font-medium">{v}</span>
          </div>
        ))}
      </div>

      {bookings.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold text-base mb-3">Recent bookings</h2>
          <div className="flex flex-col gap-2">
            {bookings.slice(0, 5).map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-white border border-black/10 rounded-xl text-sm">
                <div>
                  <div className="font-medium">{b.spot_title}</div>
                  <div className="text-xs text-muted">{new Date(b.start_time).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={b.status} />
                  <span className="font-mono text-xs">৳{parseFloat(b.total_price).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => setShowDelete(true)}
        className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
        Delete this user
      </button>

      <ConfirmDialog
        open={showDelete}
        title="Delete user?"
        message={`Permanently delete ${user.name}'s account and all associated data?`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  )
}
