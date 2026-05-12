export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 bg-paper2 rounded-xl p-1 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-shrink-0 py-2 px-4 rounded-[10px] text-sm font-semibold transition-all whitespace-nowrap ${
            active === tab.id ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-1.5 font-mono text-xs ${active === tab.id ? 'text-muted' : 'text-muted/50'}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
