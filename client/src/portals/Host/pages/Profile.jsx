import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'

export default function HostProfile() {
  const { user } = useAuth()

  const fields = [
    ['Email', user?.email],
    ['Phone', user?.phone || 'Not set'],
    ['Role', 'Host'],
    ['Member since', user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'],
  ]

  return (
    <div className="p-5 md:p-8 max-w-lg">
      <div className="font-mono text-xs text-muted tracking-wider mb-1">PROFILE</div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Your account.</h1>

      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-paper2 flex items-center justify-center flex-shrink-0">
          {user?.avatar_url
            ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
            : <span className="text-2xl font-bold">{user?.name?.[0]?.toUpperCase()}</span>
          }
        </div>
        <div>
          <div className="font-semibold text-lg">{user?.name}</div>
          <div className="text-sm text-muted">{user?.email}</div>
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

      <div className="flex flex-col gap-2">
        <Link to="/host/profile/edit"
          className="flex items-center justify-between w-full p-4 bg-white border border-black/10 rounded-2xl hover:shadow-sm hover:border-black/20 transition-all text-sm font-semibold">
          Edit profile <span className="text-muted">→</span>
        </Link>
        <Link to="/host/settings"
          className="flex items-center justify-between w-full p-4 bg-white border border-black/10 rounded-2xl hover:shadow-sm hover:border-black/20 transition-all text-sm font-semibold">
          Settings <span className="text-muted">→</span>
        </Link>
      </div>
    </div>
  )
}
