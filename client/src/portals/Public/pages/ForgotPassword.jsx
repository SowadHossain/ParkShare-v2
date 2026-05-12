import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    // placeholder — email reset not implemented (out of scope)
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-lime rounded-[10px] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 14V4h5.5a3 3 0 010 6H7" stroke="#0E0E0C" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-lg font-bold">ParkShare</span>
        </Link>

        {sent ? (
          <div>
            <div className="text-4xl mb-4">✉️</div>
            <h1 className="text-2xl font-bold mb-2">Check your inbox</h1>
            <p className="text-muted text-sm leading-relaxed mb-6">
              If an account exists for <strong>{email}</strong>, we'll send a reset link shortly.
            </p>
            <Link to="/login" className="text-sm font-semibold text-ink hover:underline">← Back to sign in</Link>
          </div>
        ) : (
          <>
            <div className="font-mono text-xs text-muted tracking-widest mb-3">PASSWORD RESET</div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Forgot your<br />password?</h1>
            <p className="text-muted text-sm mb-8 leading-relaxed">Enter your email and we'll send a reset link.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="font-mono text-[11px] text-muted tracking-wider">EMAIL</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
                  placeholder="you@example.com" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-ink text-paper rounded-full font-semibold text-sm hover:bg-ink/90 transition-colors">
                Send reset link →
              </button>
            </form>
            <p className="mt-5 text-sm text-center">
              <Link to="/login" className="text-muted hover:text-ink transition-colors">← Back to sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
