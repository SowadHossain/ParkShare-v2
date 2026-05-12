export default function Stepper({ steps, current }) {
  return (
    <div className="flex items-center gap-1.5">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-1.5">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
            i === current
              ? 'bg-ink text-paper'
              : i < current
              ? 'bg-paper2 text-muted'
              : 'text-muted/50'
          }`}>
            <span className="font-mono text-xs">{i + 1}</span>
            <span className="hidden sm:inline">{step}</span>
          </div>
          {i < steps.length - 1 && (
            <span className={`text-xs ${i < current ? 'text-muted' : 'text-muted/30'}`}>→</span>
          )}
        </div>
      ))}
    </div>
  )
}
