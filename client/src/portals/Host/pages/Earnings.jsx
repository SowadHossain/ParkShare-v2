import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'
import EarningsCard from '../components/EarningsCard.jsx'
import TransactionRow from '../components/TransactionRow.jsx'
import Tabs from '../../../components/UI/Tabs.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import EmptyState from '../../../components/UI/EmptyState.jsx'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'paid', label: 'Paid' },
  { id: 'refunded', label: 'Refunded' },
]

export default function Earnings() {
  const { user } = useAuth()
  const [txns, setTxns] = useState([])
  const [tab, setTab] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    axios.get(`${API}/transactions/host/${user.id}`)
      .then(r => setTxns(r.data))
      .finally(() => setLoading(false))
  }, [user])

  const filtered = tab === 'all' ? txns : txns.filter(t => t.status === tab)
  const total = txns.filter(t => t.status === 'paid').reduce((s, t) => s + parseFloat(t.amount), 0)
  const pending = txns.filter(t => t.status === 'pending').reduce((s, t) => s + parseFloat(t.amount), 0)

  return (
    <div className="p-8">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <div className="font-mono text-xs text-muted tracking-wider mb-1">EARNINGS</div>
          <h1 className="text-3xl font-bold tracking-tight">Money in the door.</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-8">
        <EarningsCard label="TOTAL EARNED" value={`$${total.toFixed(2)}`} sub="lifetime" tone="dark" />
        <EarningsCard label="PENDING" value={`$${pending.toFixed(2)}`} sub="from active bookings" />
        <EarningsCard label="TRANSACTIONS" value={txns.length} sub="all time" />
      </div>

      <div className="bg-white border border-black/10 rounded-2xl p-5">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-bold text-base">Transactions</h2>
          <Tabs tabs={TABS.map(t => ({ ...t, count: t.id === 'all' ? txns.length : txns.filter(x => x.status === t.id).length }))} active={tab} onChange={setTab} />
        </div>
        {loading ? <Loader size="sm" />
          : filtered.length === 0
          ? <EmptyState icon="$" title="No transactions" message="Transactions will appear here after bookings are paid." />
          : <div>{filtered.map(t => <TransactionRow key={t.id} txn={t} />)}</div>
        }
      </div>
    </div>
  )
}
