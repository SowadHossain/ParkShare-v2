import Button from './Button.jsx'

export default function EmptyState({ icon = '○', title, message, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-5 opacity-40">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      {message && <p className="text-muted text-sm mb-6 max-w-xs leading-relaxed">{message}</p>}
      {action && <Button onClick={onAction}>{action}</Button>}
    </div>
  )
}
