import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'

export default function DriverSettings() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <div className="font-mono text-xs text-muted tracking-wider mb-2">SETTINGS</div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Account settings.</h1>

      <div className="space-y-2">
        {[
          { label: 'Edit profile', action: () => navigate('/driver/profile/edit') },
          { label: 'Notifications', action: () => navigate('/driver/notifications') },
        ].map(item => (
          <button key={item.label} onClick={item.action}
            className="w-full flex items-center justify-between p-4 bg-white border border-black/10 rounded-2xl hover:bg-paper2 transition-colors text-sm font-medium">
            {item.label}
            <span className="text-muted">→</span>
          </button>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-black/10">
        <button onClick={() => { logout(); navigate('/') }}
          className="w-full py-3.5 border border-red-200 text-red-600 rounded-full text-sm font-semibold hover:bg-red-50 transition-colors">
          Sign out
        </button>
      </div>
    </div>
  )
}
