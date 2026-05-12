import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import StatusBadge from '../../../components/UI/StatusBadge.jsx'
import Loader from '../../../components/UI/Loader.jsx'

export default function TransactionDetails() {
  const { txId } = useParams()
  const [txn, setTxn] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/transactions/${txId}`).then(r => setTxn(r.data)).finally(() => setLoading(false))
  }, [txId])

  if (loading) return <Loader />
  if (!txn) return <div className="p-10 text-center text-muted">Transaction not found.</div>

  return (
    <div className="max-w-md mx-auto p-8">
      <Link to="/host/earnings" className="text-sm text-muted hover:text-ink mb-6 block">← Earnings</Link>
      <div className="font-mono text-xs text-muted tracking-wider mb-2">TRANSACTION</div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">${parseFloat(txn.amount).toFixed(2)}</h1>
      <div className="bg-white border border-black/10 rounded-2xl p-5 space-y-3 text-sm">
        {[
          ['Status', <StatusBadge status={txn.status} />],
          ['Date', new Date(txn.created_at).toLocaleString()],
          ['Spot', txn.spot_title],
          ['Driver', txn.driver_name],
          ['Stripe ID', txn.stripe_id || 'N/A'],
          ['Your earnings', `$${(parseFloat(txn.amount) * 0.85).toFixed(2)} (85%)`],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between items-center">
            <span className="text-muted">{k}</span>
            <span className="font-medium">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
