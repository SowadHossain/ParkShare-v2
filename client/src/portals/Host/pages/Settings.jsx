import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth, API } from '../../../context/AuthContext.jsx'
import ConfirmDialog from '../../../components/UI/ConfirmDialog.jsx'

function Section({ title, children }) {
  return (
    <div className="bg-white border border-black/10 rounded-2xl overflow-hidden mb-4">
      <div className="px-5 py-3 border-b border-black/5 bg-paper/60">
        <span className="font-mono text-[11px] text-muted tracking-wider">{title}</span>
      </div>
      <div className="divide-y divide-black/5">{children}</div>
    </div>
  )
}

function RowLink({ to, icon, label, sub }) {
  return (
    <Link to={to} className="flex items-center gap-3 px-5 py-3.5 hover:bg-paper2 transition-colors">
      <span className="text-lg w-6 text-center flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {sub && <div className="text-xs text-muted mt-0.5">{sub}</div>}
      </div>
      <span className="text-muted text-sm">→</span>
    </Link>
  )
}

function RowButton({ onClick, icon, label, sub, danger }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-5 py-3.5 hover:bg-paper2 transition-colors text-left ${danger ? 'text-red-600' : ''}`}>
      <span className="text-lg w-6 text-center flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {sub && <div className="text-xs text-muted mt-0.5">{sub}</div>}
      </div>
      <span className={`text-sm ${danger ? 'text-red-300' : 'text-muted'}`}>→</span>
    </button>
  )
}

function Toggle({ label, sub, storageKey }) {
  const [on, setOn] = useState(() => localStorage.getItem(storageKey) !== 'false')
  function toggle() {
    const next = !on
    setOn(next)
    localStorage.setItem(storageKey, String(next))
  }
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {sub && <div className="text-xs text-muted mt-0.5">{sub}</div>}
      </div>
      <button onClick={toggle}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${on ? 'bg-ink' : 'bg-black/20'}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  )
}

export default function HostSettings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [pwOpen, setPwOpen]         = useState(false)
  const [currentPw, setCurrentPw]   = useState('')
  const [newPw, setNewPw]           = useState('')
  const [confirmPw, setConfirmPw]   = useState('')
  const [pwSaving, setPwSaving]     = useState(false)
  const [pwError, setPwError]       = useState('')
  const [pwSuccess, setPwSuccess]   = useState('')
  const [showDelete, setShowDelete] = useState(false)
  const [showSignOut, setShowSignOut] = useState(false)

  async function handlePasswordChange(e) {
    e.preventDefault()
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return }
    if (newPw.length < 8) { setPwError('Minimum 8 characters'); return }
    setPwSaving(true); setPwError(''); setPwSuccess('')
    try {
      await axios.put(`${API}/users/${user.id}`, { currentPassword: currentPw, password: newPw })
      setPwSuccess('Password updated.')
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to update password')
    } finally {
      setPwSaving(false)
    }
  }

  async function handleDeleteAccount() {
    try {
      await axios.delete(`${API}/users/${user.id}`)
      logout(); navigate('/')
    } catch { setShowDelete(false) }
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-8 pb-12">
      <Link to="/host/profile" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-6">
        ← Profile
      </Link>
      <div className="font-mono text-xs text-muted tracking-wider mb-1">HOST</div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Settings.</h1>

      {/* Account */}
      <Section title="ACCOUNT">
        <RowLink to="/host/profile/edit" icon="✏️" label="Edit profile" sub="Name, photo, bio, phone" />
        <RowLink to="/host/spots"        icon="🅿️" label="My spots"     sub="Manage your parking listings" />
        <RowLink to="/host/earnings"     icon="💵" label="Earnings"     sub="View payouts and transactions" />
        <RowButton
          icon="🔑"
          label="Change password"
          sub={user?.google_id ? 'Not available for Google accounts' : 'Update your login password'}
          onClick={() => !user?.google_id && setPwOpen(v => !v)}
        />
        {pwOpen && !user?.google_id && (
          <div className="px-5 pb-5 pt-2">
            {pwError   && <div className="mb-3 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{pwError}</div>}
            {pwSuccess && <div className="mb-3 p-3 bg-green-50 text-green-700 rounded-xl text-sm">{pwSuccess}</div>}
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
              {[['Current password', currentPw, setCurrentPw], ['New password', newPw, setNewPw], ['Confirm new password', confirmPw, setConfirmPw]]
                .map(([label, val, setter]) => (
                  <div key={label}>
                    <label className="font-mono text-[10px] text-muted tracking-wider block mb-1">{label.toUpperCase()}</label>
                    <input type="password" value={val} onChange={e => setter(e.target.value)} required
                      className="w-full px-4 py-3 bg-paper border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20" />
                  </div>
                ))}
              <button type="submit" disabled={pwSaving}
                className="w-full py-3 bg-ink text-paper rounded-xl text-sm font-semibold hover:bg-ink/90 disabled:opacity-50 transition-colors">
                {pwSaving ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </div>
        )}
      </Section>

      {/* KYC info */}
      <Section title="IDENTITY & KYC">
        <div className="px-5 py-3.5 flex items-center gap-3">
          <span className="text-lg w-6 text-center">🪪</span>
          <div className="flex-1">
            <div className="text-sm font-medium">National ID</div>
            <div className="text-xs font-mono text-muted mt-0.5">{user?.nid || '—'}</div>
          </div>
          <span className="font-mono text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-md">VERIFIED</span>
        </div>
      </Section>

      {/* Listing preferences */}
      <Section title="LISTING PREFERENCES">
        <Toggle label="Auto-accept bookings"   sub="Bookings go straight to paid without review"  storageKey="host_auto_accept"   />
        <Toggle label="Instant availability"   sub="Show your spots as available by default"       storageKey="host_instant_avail" />
        <Toggle label="Allow repeat guests"    sub="Prioritise drivers who've parked with you"     storageKey="host_repeat_guests" />
      </Section>

      {/* Notifications */}
      <Section title="NOTIFICATIONS">
        <Toggle label="New bookings"       sub="When a driver books your spot"           storageKey="host_notif_bookings"     />
        <Toggle label="Cancellations"      sub="When a driver cancels"                   storageKey="host_notif_cancellations" />
        <Toggle label="Payment received"   sub="When a booking payment is confirmed"     storageKey="host_notif_payments"     />
        <Toggle label="New reviews"        sub="When a driver leaves you a review"       storageKey="host_notif_reviews"      />
        <Toggle label="Platform updates"   sub="News and tips from ParkShare"            storageKey="host_notif_platform"     />
        <RowLink to="/host/notifications" icon="🔔" label="View all notifications" />
      </Section>

      {/* Support */}
      <Section title="SUPPORT">
        <RowLink to="/how-it-works" icon="📖" label="How ParkShare works" />
        <RowLink to="/about"        icon="ℹ️"  label="About ParkShare"    sub="CSE482 Lab Project · Group 05" />
      </Section>

      {/* Danger zone */}
      <Section title="DANGER ZONE">
        <RowButton icon="↩" label="Sign out" sub="You can sign back in anytime" onClick={() => setShowSignOut(true)} />
        <RowButton icon="🗑️" label="Delete account" sub="Removes your account and all listings" onClick={() => setShowDelete(true)} danger />
      </Section>

      <ConfirmDialog
        open={showSignOut}
        title="Sign out?"
        message="You'll need to log in again to access your account."
        confirmLabel="Sign out"
        onConfirm={() => { logout(); navigate('/') }}
        onCancel={() => setShowSignOut(false)}
      />
      <ConfirmDialog
        open={showDelete}
        title="Delete account?"
        message="This permanently deletes your account, all your spots, booking history, and earnings data. This cannot be undone."
        confirmLabel="Delete my account"
        danger
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  )
}
