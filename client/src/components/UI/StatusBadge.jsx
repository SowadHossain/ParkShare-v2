const styles = {
  pending:   'bg-yellow-100 text-yellow-800',
  approved:  'bg-lime/60 text-ink',
  rejected:  'bg-red-100 text-red-700',
  paid:      'bg-lime/40 text-ink',
  active:    'bg-blue-100 text-blue-800',
  completed: 'bg-paper2 text-muted',
  cancelled: 'bg-red-100 text-red-700',
  refunded:  'bg-orange-100 text-orange-700',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider ${styles[status] || 'bg-paper2 text-muted'}`}>
      {status}
    </span>
  )
}
