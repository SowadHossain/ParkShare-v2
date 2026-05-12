import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper text-center px-6">
      <div className="font-mono text-8xl font-bold text-paper2 mb-6">404</div>
      <h1 className="text-3xl font-bold mb-3">Page not found</h1>
      <p className="text-muted text-sm mb-8 max-w-xs leading-relaxed">
        Looks like this spot is taken — or maybe it never existed. Let's get you back on track.
      </p>
      <Link to="/" className="px-6 py-3.5 bg-ink text-paper rounded-full font-semibold text-sm hover:bg-ink/90 transition-colors">
        Back to home →
      </Link>
    </div>
  )
}
