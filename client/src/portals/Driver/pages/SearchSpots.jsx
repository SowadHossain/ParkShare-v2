import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import SpotCard from '../components/SpotCard.jsx'
import FilterPanel from '../components/FilterPanel.jsx'
import MapView from '../components/MapView.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import EmptyState from '../../../components/UI/EmptyState.jsx'

const DEFAULT_CENTER = { lat: 23.7937, lng: 90.4066 }
const DEFAULT_FILTERS = { maxPrice: 10, vehicleSize: '', minRating: 0 }

export default function SearchSpots() {
  const [spots, setSpots] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [showMap, setShowMap] = useState(true)

  const fetchSpots = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        lat: center.lat, lng: center.lng,
        ...(filters.maxPrice < 10 && { maxPrice: filters.maxPrice }),
        ...(filters.vehicleSize && { vehicleSize: filters.vehicleSize }),
        ...(filters.minRating > 0 && { minRating: filters.minRating }),
      }
      const res = await axios.get(`${API}/spots`, { params })
      setSpots(res.data)
    } catch {}
    setLoading(false)
  }, [center.lat, center.lng, filters.maxPrice, filters.vehicleSize, filters.minRating])

  useEffect(() => { fetchSpots() }, [fetchSpots])

  // Try to get user location on mount
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(pos => {
      setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude })
    })
  }, [])

  return (
    <div className="flex h-[calc(100vh-65px)]">
      {/* Filters sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-black/10 bg-paper overflow-y-auto p-5 hidden md:block">
        <div className="font-mono text-[11px] text-muted tracking-wider mb-1">FILTERS</div>
        <h2 className="text-xl font-bold mb-5">Refine</h2>
        <FilterPanel filters={filters} onChange={setFilters} />
        <div className="mt-6 p-4 bg-ink text-paper rounded-2xl">
          <div className="font-mono text-[10px] text-lime tracking-wider mb-1">RESULTS</div>
          <div className="font-mono text-2xl font-bold">{spots.length} spots</div>
        </div>
      </div>

      {/* Cards list */}
      <div className="w-80 flex-shrink-0 border-r border-black/10 bg-white overflow-y-auto hidden md:block">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3 text-xs text-muted">
            <span>Sorted by <strong className="text-ink">rating</strong></span>
            <button onClick={() => setShowMap(s => !s)} className="font-semibold text-ink">{showMap ? 'Hide map' : 'Show map'}</button>
          </div>
          {loading
            ? <Loader size="sm" />
            : spots.length === 0
            ? <EmptyState icon="◻" title="No spots found" message="Try widening your filters or moving the map." />
            : <div className="flex flex-col gap-2">
                {spots.map((s, i) => <SpotCard key={s.id} spot={s} index={i} />)}
              </div>
          }
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapView spots={spots} center={center} onCenterChange={setCenter} />
        {/* Mobile search bar overlay */}
        <div className="absolute top-3 left-3 right-3 md:hidden">
          <div className="bg-white rounded-2xl shadow-lg p-3 flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#8A8275" strokeWidth="2" />
              <path d="M11 11l4 4" stroke="#8A8275" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-sm text-muted">Search location…</span>
          </div>
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-ink/90 text-paper rounded-full font-mono text-[10px] tracking-wider">
          ● MAP · {spots.length} SPOTS
        </div>
      </div>
    </div>
  )
}
