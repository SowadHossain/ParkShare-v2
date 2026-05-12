import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import StarRating from '../../../components/UI/StarRating.jsx'

export default function ReviewRow({ review, onDelete }) {
  return (
    <div className="p-4 bg-white border border-black/10 rounded-2xl hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StarRating value={review.rating} size="sm" />
            <span className="font-mono text-xs text-muted">{review.rating}/5</span>
          </div>
          <p className="text-sm text-muted">{review.comment || <em className="text-muted/60">No comment</em>}</p>
          <div className="text-xs text-muted mt-2">
            By <strong>{review.reviewer_name}</strong> → <strong>{review.reviewee_name}</strong>
            {review.spot_title && <> · {review.spot_title}</>}
          </div>
          <div className="text-xs text-muted/60 mt-0.5">{new Date(review.created_at).toLocaleString()}</div>
        </div>
        <button onClick={() => onDelete(review.id)}
          className="text-xs text-muted hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0">
          Delete
        </button>
      </div>
    </div>
  )
}
