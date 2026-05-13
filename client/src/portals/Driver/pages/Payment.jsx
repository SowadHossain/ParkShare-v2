import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { API } from '../../../context/AuthContext.jsx'
import Loader from '../../../components/UI/Loader.jsx'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

function PayForm({ bookingId, amount, onSuccess, onFail }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePay(e) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.post(`${API}/payments/create-intent`, { bookingId })
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      })
      if (result.error) {
        setError(result.error.message)
        onFail()
      } else if (result.paymentIntent.status === 'succeeded') {
        await axios.post(`${API}/payments/confirm`, {
          bookingId,
          stripePaymentId: result.paymentIntent.id,
        })
        onSuccess()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed')
      onFail()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handlePay} className="flex flex-col gap-5">
      <div>
        <label className="font-mono text-[11px] text-muted tracking-wider block mb-2">CARD DETAILS</label>
        <div className="p-4 bg-white border border-black/10 rounded-xl">
          <CardElement options={{ style: { base: { fontSize: '15px', fontFamily: 'DM Sans, sans-serif', color: '#0E0E0C' } } }} />
        </div>
      </div>
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
      <button type="submit" disabled={loading || !stripe}
        className="w-full py-4 bg-ink text-paper rounded-full font-semibold hover:bg-ink/90 disabled:opacity-50 transition-colors">
        {loading ? 'Processing…' : `Pay $${amount} →`}
      </button>
      <div className="text-center text-xs text-muted">Test card: 4242 4242 4242 4242</div>
    </form>
  )
}

export default function Payment() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/bookings/${bookingId}`)
      .then(r => setBooking(r.data))
      .finally(() => setLoading(false))
  }, [bookingId])

  if (loading) return <Loader />
  if (!booking) return <div className="p-10 text-center text-muted">Booking not found.</div>

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <div className="font-mono text-xs text-muted tracking-wider mb-2">PAYMENT</div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Secure payment.</h1>
      <p className="text-muted text-sm mb-8">{booking.spot_title} · ৳{parseFloat(booking.total_price).toFixed(2)}</p>
      <Elements stripe={stripePromise}>
        <PayForm
          bookingId={bookingId}
          amount={parseFloat(booking.total_price).toFixed(2)}
          onSuccess={() => navigate(`/driver/checkout/${bookingId}/success`)}
          onFail={() => navigate(`/driver/checkout/${bookingId}/failed`)}
        />
      </Elements>
    </div>
  )
}
