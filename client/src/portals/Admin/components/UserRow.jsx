import { Link } from 'react-router-dom'

export default function UserRow({ user, onDelete }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-black/10 rounded-2xl hover:shadow-sm transition-all">
      <div className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center text-sm font-bold flex-shrink-0">
        {user.name?.[0]?.toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{user.name}</div>
        <div className="text-xs text-muted">{user.email}</div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${
          user.role === 'admin' ? 'bg-ink text-paper' :
          user.role === 'host' ? 'bg-lime text-ink' :
          'bg-paper2 text-muted'
        }`}>
          {user.role}
        </span>
        <Link to={`/admin/users/${user.id}`} className="text-xs text-muted hover:text-ink px-2 py-1 rounded-lg hover:bg-black/5 transition-colors">
          View →
        </Link>
        <button onClick={() => onDelete(user.id)} className="text-xs text-muted hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
          Delete
        </button>
      </div>
    </div>
  )
}
