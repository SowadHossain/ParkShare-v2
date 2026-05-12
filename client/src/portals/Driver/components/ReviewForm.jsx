import { useState } from 'react'
import StarRating from '../../../components/UI/StarRating.jsx'
import Button from '../../../components/UI/Button.jsx'

export default function ReviewForm({ onSubmit, loading }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!rating) return
    onSubmit({ rating, comment })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="font-mono text-[11px] text-muted tracking-wider block mb-3">YOUR RATING</label>
        <StarRating value={rating} onChange={setRating} size="lg" />
        {!rating && <p className="text-xs text-muted mt-2">Please select a rating</p>}
      </div>
      <div>
        <label className="font-mono text-[11px] text-muted tracking-wider block mb-2">YOUR REVIEW</label>
        <textarea
          value={comment} onChange={e => setComment(e.target.value)}
          rows={4} placeholder="Tell others what you thought about this parking spot…"
          className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 resize-none"
        />
      </div>
      <Button type="submit" disabled={!rating || loading} fullWidth>
        {loading ? 'Submitting…' : 'Submit review →'}
      </Button>
    </form>
  )
}
