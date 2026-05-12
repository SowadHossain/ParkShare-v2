import { useAuth } from '../../../context/AuthContext.jsx'
import { Link } from 'react-router-dom'

export default function DriverProfile() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="max-w-lg mx-auto px-5 py-8">
      <div className="font-mono text-xs text-muted tracking-wider mb-1">DRIVER PROFILE</div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Your account.</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-paper2 flex items-center justify-center flex-shrink-0">
          {user.avatar_url
            ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
            : <span className="text-2xl font-bold">{user.name?.charAt(0)?.toUpperCase()}</span>
          }
        </div>
        <div>
          <div className="font-semibold text-lg">{user.name}</div>
          <div className="text-sm text-muted">{user.email}</div>
        </div>
      </div>

      <div className="bg-white border border-black/10 rounded-2xl p-5 mb-4 space-y-3 text-sm">
        {user.phone && (
          <div className="flex justify-between">
            <span className="text-muted">Phone</span>
            <span className="font-medium">{user.phone}</span>
          </div>
        )}
        {user.bio && (
          <div>
            <span className="text-muted block mb-1">Bio</span>
            <p className="text-sm leading-relaxed">{user.bio}</p>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted">Member since</span>
          <span className="font-medium font-mono">{new Date(user.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Link to="/driver/profile/edit"
          className="w-full py-3.5 border border-black/10 rounded-full text-sm font-semibold text-center block hover:bg-paper2 transition-colors">
          Edit profile →
        </Link>
        <Link to="/driver/settings"
          className="w-full py-3.5 border border-black/10 rounded-full text-sm font-semibold text-center block hover:bg-paper2 transition-colors text-muted">
          Settings
        </Link>
      </div>
    </div>
  )
}
