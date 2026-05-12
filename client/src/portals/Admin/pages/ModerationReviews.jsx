import { useEffect, useState } from 'react'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import ReviewRow from '../components/ReviewRow.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import EmptyState from '../../../components/UI/EmptyState.jsx'
import ConfirmDialog from '../../../components/UI/ConfirmDialog.jsx'

export default function ModerationReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    axios.get(`${API}/reviews`)
      .then(r => setReviews(r.data))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete() {
    await axios.delete(`${API}/reviews/${deleteId}`)
    setReviews(prev => prev.filter(r => r.id !== deleteId))
    setDeleteId(null)
  }

  return (
    <div className="p-8">
      <div className="font-mono text-xs text-muted tracking-wider mb-1">ADMIN · REVIEWS</div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Reviews.</h1>

      {loading ? <Loader size="sm" />
        : reviews.length === 0
        ? <EmptyState icon="★" title="No reviews yet" message="Reviews will appear here once users start submitting them." />
        : (
          <div className="flex flex-col gap-2">
            {reviews.map(r => <ReviewRow key={r.id} review={r} onDelete={setDeleteId} />)}
          </div>
        )
      }

      <ConfirmDialog
        open={!!deleteId}
        title="Delete review?"
        message="This will permanently remove the review. This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
