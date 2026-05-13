import { Link } from 'react-router-dom'
import StatusBadge from '../../../components/UI/StatusBadge.jsx'

export default function TransactionRow({ txn }) {
  return (
    <Link to={`/host/earnings/${txn.id}`}
      className="flex items-center gap-4 py-3.5 border-b border-black/8 hover:bg-paper2/50 transition-colors px-1 -mx-1 rounded-xl">
      <div className="font-mono text-xs text-muted w-20 flex-shrink-0">
        {new Date(txn.created_at).toLocaleDateString('en-BD', { month: 'short', day: 'numeric' })}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{txn.spot_title}</div>
        <div className="text-xs text-muted truncate">{txn.driver_name}</div>
      </div>
      <StatusBadge status={txn.status} />
      <div className={`font-mono text-sm font-bold flex-shrink-0 ${txn.status === 'refunded' ? 'text-red-600' : 'text-ink'}`}>
        {txn.status === 'refunded' ? '-' : '+'}৳{parseFloat(txn.amount).toFixed(2)}
      </div>
    </Link>
  )
}
