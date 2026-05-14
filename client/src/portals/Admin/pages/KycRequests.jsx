import { useEffect, useState } from 'react'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import Loader from '../../../components/UI/Loader.jsx'

export default function KycRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [resubmitTarget, setResubmitTarget] = useState(null)
  const [reason, setReason] = useState('')
  const [acting, setActing] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => { fetchRequests() }, [])

  async function fetchRequests() {
    setLoading(true)
    try {
      const { data } = await axios.get(`${API}/admin/kyc-requests`)
      setRequests(data)
    } finally {
      setLoading(false)
    }
  }

  async function approve(id) {
    setError('')
    setActing(id)
    try {
      await axios.post(`${API}/admin/kyc-requests/${id}/approve`)
      setRequests(r => r.filter(u => u.id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve')
    } finally {
      setActing(null)
    }
  }

  async function reject() {
    if (!rejectTarget) return
    setError('')
    setActing(rejectTarget.id)
    try {
      await axios.post(`${API}/admin/kyc-requests/${rejectTarget.id}/reject`, { reason })
      setRequests(r => r.filter(u => u.id !== rejectTarget.id))
      setRejectTarget(null)
      setReason('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject')
    } finally {
      setActing(null)
    }
  }

  async function requestResubmit() {
    if (!resubmitTarget) return
    setError('')
    setActing(resubmitTarget.id)
    try {
      await axios.post(`${API}/admin/kyc-requests/${resubmitTarget.id}/request-resubmit`, { reason })
      setRequests(r => r.filter(u => u.id !== resubmitTarget.id))
      setResubmitTarget(null)
      setReason('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request resubmit')
    } finally {
      setActing(null)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="p-8 max-w-4xl">
      <div className="font-mono text-xs text-muted tracking-wider mb-1">ADMIN</div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">KYC Requests</h1>
      <p className="text-sm text-muted mb-8">Review pending identity verifications. Conflict badges appear when an NID or plate is already linked to an approved account.</p>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}

      {requests.length === 0 ? (
        <div className="text-center py-20 text-muted text-sm">No pending KYC requests.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map(u => (
            <div key={u.id} className="bg-white border border-black/10 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{u.name}</span>
                    <span className="font-mono text-[10px] bg-paper2 px-2 py-0.5 rounded-md uppercase">{u.role}</span>
                  </div>
                  <div className="text-xs text-muted mb-3">{u.email}</div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <div className="font-mono text-[10px] text-muted tracking-wider mb-0.5">NID</div>
                      <div className="font-mono font-medium flex items-center gap-2">
                        {u.nid || '—'}
                        {u.nid_conflict && (
                          <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-mono font-bold">
                            IN USE · {u.nid_conflict}
                          </span>
                        )}
                      </div>
                    </div>
                    {u.license_plate && (
                      <div>
                        <div className="font-mono text-[10px] text-muted tracking-wider mb-0.5">PLATE</div>
                        <div className="font-mono font-medium flex items-center gap-2">
                          {u.license_plate}
                          {u.plate_conflict && (
                            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-mono font-bold">
                              IN USE · {u.plate_conflict}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                  <button
                    onClick={() => approve(u.id)}
                    disabled={acting === u.id}
                    className="px-4 py-2 bg-lime text-ink rounded-xl text-sm font-semibold hover:bg-lime/80 disabled:opacity-50 transition-colors">
                    Approve
                  </button>
                  <button
                    onClick={() => { setResubmitTarget(u); setReason('') }}
                    disabled={acting === u.id}
                    className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-xl text-sm font-semibold hover:bg-yellow-100 disabled:opacity-50 transition-colors">
                    Resubmit
                  </button>
                  <button
                    onClick={() => { setRejectTarget(u); setReason('') }}
                    disabled={acting === u.id}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 disabled:opacity-50 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Resubmit modal */}
      {resubmitTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="font-bold text-base mb-1">Request Resubmission</h2>
            <p className="text-sm text-muted mb-4">Ask <span className="font-semibold text-ink">{resubmitTarget.name}</span> to resubmit. Optionally explain what needs to be corrected.</p>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ink/20 mb-4"
              placeholder="What needs to be corrected? (optional)..."
            />
            <div className="flex gap-2">
              <button onClick={requestResubmit} disabled={acting === resubmitTarget.id}
                className="flex-1 py-2.5 bg-yellow-600 text-white rounded-xl text-sm font-semibold hover:bg-yellow-700 disabled:opacity-50 transition-colors">
                {acting === resubmitTarget.id ? 'Requesting…' : 'Request resubmit'}
              </button>
              <button onClick={() => setResubmitTarget(null)}
                className="flex-1 py-2.5 bg-paper2 text-ink rounded-xl text-sm font-semibold hover:bg-paper2/70 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="font-bold text-base mb-1">Reject KYC</h2>
            <p className="text-sm text-muted mb-4">Rejecting <span className="font-semibold text-ink">{rejectTarget.name}</span>. Optionally provide a reason — it will be sent as a notification.</p>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 border border-black/10 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ink/20 mb-4"
              placeholder="Reason (optional)..."
            />
            <div className="flex gap-2">
              <button onClick={reject} disabled={acting === rejectTarget.id}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors">
                {acting === rejectTarget.id ? 'Rejecting…' : 'Confirm reject'}
              </button>
              <button onClick={() => setRejectTarget(null)}
                className="flex-1 py-2.5 bg-paper2 text-ink rounded-xl text-sm font-semibold hover:bg-paper2/70 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
