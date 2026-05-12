import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'
import Button from '../../../components/UI/Button.jsx'
import ConfirmDialog from '../../../components/UI/ConfirmDialog.jsx'

export default function HostSettings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [saving, setSaving] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [showDelete, setShowDelete] = useState(false)

  async function handlePasswordChange(e) {
    e.preventDefault()
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return }
    if (newPw.length < 8) { setPwError('Password must be at least 8 characters'); return }
    setSaving(true)
    setPwError('')
    setPwSuccess('')
    try {
      await axios.put(`${API}/users/${user.id}`, { currentPassword: currentPw, password: newPw })
      setPwSuccess('Password updated successfully.')
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAccount() {
    try {
      await axios.delete(`${API}/users/${user.id}`)
      logout()
      navigate('/')
    } catch {
      setShowDelete(false)
    }
  }

  return (
    <div className="p-8 max-w-lg">
      <div className="font-mono text-xs text-muted tracking-wider mb-1">SETTINGS</div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Settings.</h1>

      <div className="bg-white border border-black/10 rounded-2xl p-5 mb-6">
        <h2 className="font-bold text-base mb-4">Change password</h2>
        {user?.google_id && (
          <p className="text-sm text-muted mb-4">You signed in with Google. Password change is not available.</p>
        )}
        {!user?.google_id && (
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
            {pwError && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{pwError}</div>}
            {pwSuccess && <div className="p-3 bg-green-50 text-green-700 rounded-xl text-sm">{pwSuccess}</div>}
            {[
              ['CURRENT PASSWORD', currentPw, setCurrentPw],
              ['NEW PASSWORD', newPw, setNewPw],
              ['CONFIRM NEW PASSWORD', confirmPw, setConfirmPw],
            ].map(([label, val, setter]) => (
              <div key={label}>
                <label className="font-mono text-[11px] text-muted tracking-wider block mb-2">{label}</label>
                <input type="password" value={val} onChange={e => setter(e.target.value)} required
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20" />
              </div>
            ))}
            <Button type="submit" disabled={saving} variant="secondary">
              {saving ? 'Updating…' : 'Update password'}
            </Button>
          </form>
        )}
      </div>

      <div className="bg-white border border-red-100 rounded-2xl p-5">
        <h2 className="font-bold text-base mb-1 text-red-600">Danger zone</h2>
        <p className="text-sm text-muted mb-4">Permanently delete your account and all associated data.</p>
        <Button variant="danger" onClick={() => setShowDelete(true)}>Delete account</Button>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="Delete account?"
        message="This will permanently delete your account, all your spots, and booking history. This action cannot be undone."
        confirmLabel="Delete account"
        danger
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  )
}
