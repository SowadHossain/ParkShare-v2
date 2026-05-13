import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'

const BDT = { timeZone: 'Asia/Dhaka' }

function todayBDT() {
  return new Date().toLocaleDateString('en-CA', BDT) // YYYY-MM-DD
}

function parseTimeBDT(dateObj) {
  // Returns { h, m } in BDT from a UTC Date
  const [h, m] = dateObj.toLocaleTimeString('en-GB', { ...BDT, hour: '2-digit', minute: '2-digit' }).split(':').map(Number)
  return { h, m }
}

function formatTimeBDT(dateObj) {
  return dateObj.toLocaleTimeString('en-BD', { ...BDT, hour: '2-digit', minute: '2-digit', hour12: true })
}

function makeBDTSlots(date, availableFrom, availableTo) {
  const fromStr = availableFrom ? availableFrom.slice(0, 5) : '00:00'
  const toStr   = availableTo   ? availableTo.slice(0, 5)   : '23:45'
  const slotEnd = new Date(date + 'T' + toStr + ':00+06:00')
  const slots   = []
  const cur     = new Date(date + 'T' + fromStr + ':00+06:00')
  while (cur < slotEnd) {
    slots.push(new Date(cur))
    cur.setMinutes(cur.getMinutes() + 15)
  }
  return slots
}

function isSlotBooked(slotStart, bookedRanges) {
  const slotEnd = new Date(slotStart.getTime() + 15 * 60 * 1000)
  return bookedRanges.some(r => {
    const bs = new Date(r.start), be = new Date(r.end)
    return slotStart < be && slotEnd > bs
  })
}

function maxEndForStart(startSlot, bookedRanges, availableToStr, date) {
  const toStr   = availableToStr ? availableToStr.slice(0, 5) : '23:45'
  const hardEnd = new Date(date + 'T' + toStr + ':00+06:00')
  let cap = hardEnd
  for (const r of bookedRanges) {
    const bs = new Date(r.start)
    if (bs > startSlot && bs < cap) cap = bs
  }
  return cap
}

export default function BookSpot() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [spot, setSpot] = useState(null)
  const [selectedDate, setSelectedDate] = useState(todayBDT())
  const [startSlot, setStartSlot] = useState(null)
  const [endSlot, setEndSlot] = useState(null)
  const [bookedRanges, setBookedRanges] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    axios.get(`${API}/spots/${id}`).then(r => setSpot(r.data))
  }, [id])

  const fetchBookedSlots = useCallback(async (date) => {
    setLoadingSlots(true)
    try {
      const r = await axios.get(`${API}/spots/${id}/booked-slots`, { params: { date } })
      setBookedRanges(r.data)
    } catch {
      setBookedRanges([])
    } finally {
      setLoadingSlots(false)
    }
  }, [id])

  useEffect(() => {
    setStartSlot(null)
    setEndSlot(null)
    fetchBookedSlots(selectedDate)
  }, [selectedDate, fetchBookedSlots])

  if (!spot) return <div className="p-10 text-center text-muted">Loading…</div>

  const allSlots = makeBDTSlots(selectedDate, spot.available_from, spot.available_to)

  // Start slots: not within any booked range, and at least 1h before available_to
  const toStr = spot.available_to ? spot.available_to.slice(0, 5) : '23:45'
  const latestStart = new Date(selectedDate + 'T' + toStr + ':00+06:00')
  latestStart.setMinutes(latestStart.getMinutes() - 60)
  const startSlots = allSlots.filter(s => s <= latestStart && !isSlotBooked(s, bookedRanges))

  // End slots: only after start chosen; must be >= start + 1h, capped by next booking
  let endSlots = []
  if (startSlot) {
    const cap = maxEndForStart(startSlot, bookedRanges, spot.available_to, selectedDate)
    const minEnd = new Date(startSlot.getTime() + 60 * 60 * 1000)
    endSlots = []
    const cur = new Date(startSlot.getTime() + 15 * 60 * 1000)
    while (cur <= cap) {
      if (cur >= minEnd) endSlots.push(new Date(cur))
      cur.setMinutes(cur.getMinutes() + 15)
    }
  }

  const hours = startSlot && endSlot ? (endSlot - startSlot) / 3600000 : 0
  const total = hours > 0 ? (hours * parseFloat(spot.hourly_price)).toFixed(2) : '0.00'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!startSlot || !endSlot) { setError('Please select start and end times'); return }
    setError('')
    setSubmitting(true)
    try {
      const res = await axios.post(`${API}/bookings`, {
        spotId: id,
        startTime: startSlot.toISOString(),
        endTime:   endSlot.toISOString(),
      })
      navigate(`/driver/bookings/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <Link to={`/driver/spots/${id}`} className="text-sm text-muted hover:text-ink mb-6 block">← Back to spot</Link>
      <div className="font-mono text-xs text-muted tracking-wider mb-2">BOOKING</div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">{spot.title}</h1>
      <p className="text-muted text-sm mb-1">{spot.address}</p>
      {spot.available_from && spot.available_to && (
        <p className="text-xs text-muted mb-8 font-mono">
          Available {spot.available_from.slice(0,5)} – {spot.available_to.slice(0,5)} · ৳{parseFloat(spot.hourly_price).toFixed(0)}/hr · Min 1 hour
        </p>
      )}

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Date picker */}
        <div>
          <label className="font-mono text-[11px] text-muted tracking-wider">DATE</label>
          <input type="date" required
            min={todayBDT()}
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="mt-1.5 w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20" />
        </div>

        {/* Start time slot grid */}
        <div>
          <label className="font-mono text-[11px] text-muted tracking-wider mb-3 block">
            START TIME {startSlot && <span className="text-ink">· {formatTimeBDT(startSlot)}</span>}
          </label>
          {loadingSlots ? (
            <div className="text-xs text-muted animate-pulse">Loading availability…</div>
          ) : startSlots.length === 0 ? (
            <div className="text-xs text-muted">No available slots on this date.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {startSlots.map(slot => {
                const isSelected = startSlot && slot.getTime() === startSlot.getTime()
                return (
                  <button key={slot.toISOString()} type="button"
                    onClick={() => { setStartSlot(slot); setEndSlot(null) }}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold border transition-all ${
                      isSelected
                        ? 'bg-ink text-paper border-ink'
                        : 'bg-white text-ink border-black/15 hover:border-black/40'
                    }`}>
                    {formatTimeBDT(slot)}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* End time slot grid */}
        {startSlot && (
          <div>
            <label className="font-mono text-[11px] text-muted tracking-wider mb-3 block">
              END TIME {endSlot && <span className="text-ink">· {formatTimeBDT(endSlot)}</span>}
            </label>
            {endSlots.length === 0 ? (
              <div className="text-xs text-muted">No available end times after this slot.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {endSlots.map(slot => {
                  const isSelected = endSlot && slot.getTime() === endSlot.getTime()
                  return (
                    <button key={slot.toISOString()} type="button"
                      onClick={() => setEndSlot(slot)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold border transition-all ${
                        isSelected
                          ? 'bg-ink text-paper border-ink'
                          : 'bg-white text-ink border-black/15 hover:border-black/40'
                      }`}>
                      {formatTimeBDT(slot)}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        {hours > 0 && (
          <div className="p-4 bg-paper2 rounded-2xl">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">৳{parseFloat(spot.hourly_price).toFixed(0)} × {hours.toFixed(1)}h</span>
              <span className="font-mono font-bold">৳{total}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-black/10">
              <span>Total</span>
              <span className="font-mono">৳{total}</span>
            </div>
          </div>
        )}

        <button type="submit" disabled={submitting || !startSlot || !endSlot}
          className="w-full py-4 bg-ink text-paper rounded-full font-semibold hover:bg-ink/90 disabled:opacity-50 transition-colors">
          {submitting ? 'Requesting…' : hours > 0 ? `Request booking · ৳${total}` : 'Select times above'}
        </button>
      </form>
    </div>
  )
}
