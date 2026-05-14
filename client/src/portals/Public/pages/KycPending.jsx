import { useAuth } from '../../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function KycPending() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🕐</span>
        </div>
        <div className="font-mono text-xs text-muted tracking-widest mb-3">KYC UNDER REVIEW</div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Application submitted.</h1>
        <p className="text-sm text-muted leading-relaxed mb-8">
          {user?.name ? `Hi ${user.name.split(' ')[0]}, your` : 'Your'} KYC application is being reviewed by our team.
          This usually takes a short while. You'll receive a notification once it's approved.
        </p>

        <div className="p-4 bg-white border border-black/10 rounded-2xl text-left mb-8">
          <div className="font-mono text-[11px] text-muted tracking-wider mb-3">SUBMITTED DETAILS</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Name</span>
              <span className="font-medium">{user?.name || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Role</span>
              <span className="font-medium capitalize">{user?.role || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">NID</span>
              <span className="font-mono font-medium">{user?.nid || '—'}</span>
            </div>
            {user?.license_plate && (
              <div className="flex justify-between">
                <span className="text-muted">License plate</span>
                <span className="font-mono font-medium">{user.license_plate}</span>
              </div>
            )}
          </div>
        </div>

        <button onClick={handleSignOut}
          className="w-full py-3 border border-black/10 rounded-full text-sm font-semibold text-muted hover:text-ink hover:border-black/30 transition-colors">
          Sign out
        </button>
      </div>
    </div>
  )
}
