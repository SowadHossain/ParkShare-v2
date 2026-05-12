export default function StarRating({ value = 0, onChange, size = 'md' }) {
  const sz = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' }
  return (
    <div className="flex gap-1" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`${sz[size]} leading-none transition-colors ${star <= value ? 'text-yellow-500' : 'text-paper2'} ${onChange ? 'cursor-pointer hover:text-yellow-400' : 'cursor-default'}`}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
