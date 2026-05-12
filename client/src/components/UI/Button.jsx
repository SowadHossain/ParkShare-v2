export default function Button({ children, variant = 'primary', onClick, type = 'button', disabled = false, className = '', fullWidth = false }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold text-sm rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3'
  const variants = {
    primary: 'bg-ink text-paper hover:bg-ink/90',
    secondary: 'bg-white border border-black/10 text-ink hover:bg-paper2',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    lime: 'bg-lime text-ink hover:opacity-90',
    ghost: 'text-muted hover:text-ink',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  )
}
