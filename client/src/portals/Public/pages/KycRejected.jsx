import { useAuth } from '../../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function KycRejected() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✕</span>
        </div>
        <div className="font-mono text-xs text-red-500 tracking-widest mb-3">KYC REJECTED</div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Application rejected.</h1>
        <p className="text-sm text-muted leading-relaxed mb-8">
          {user?.name ? `Hi ${user.name.split(' ')[0]}, your` : 'Your'} KYC application was not approved.
          Please check your notifications for the reason, correct your details, and resubmit.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/kyc-complete')}
            className="w-full py-3.5 bg-ink text-paper rounded-full text-sm font-semibold hover:bg-ink/90 transition-colors">
            Correct &amp; resubmit →
          </button>
          <button onClick={handleSignOut}
            className="w-full py-3 border border-black/10 rounded-full text-sm font-semibold text-muted hover:text-ink hover:border-black/30 transition-colors">
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
