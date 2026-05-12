import { useAuth } from '../../../context/AuthContext.jsx'
import { Link } from 'react-router-dom'

export default function DriverProfile() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="font-mono text-xs text-muted tracking-wider mb-2">DRIVER PROFILE</div>
          <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
          <div className="text-muted text-sm mt-1">{user.email}</div>
        </div>
        <div className="w-16 h-16 rounded-full bg-paper2 flex items-center justify-center text-2xl font-bold">
          {user.name?.charAt(0)?.toUpperCase()}
        </div>
      </div>

      <div className="bg-white border border-black/10 rounded-2xl p-5 mb-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Email</span>
          <span className="font-medium">{user.email}</span>
        </div>
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

      <Link to="/driver/profile/edit" className="w-full py-3.5 border border-black/10 rounded-full text-sm font-semibold text-center block hover:bg-paper2 transition-colors">
        Edit profile →
      </Link>
    </div>
  )
}
