import { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { API } from '../../../context/AuthContext.jsx'
import SpotCard from '../components/SpotCard.jsx'
import FilterPanel from '../components/FilterPanel.jsx'
import MapView from '../components/MapView.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import EmptyState from '../../../components/UI/EmptyState.jsx'

const DEFAULT_CENTER  = { lat: 23.7937, lng: 90.4066 }
const DEFAULT_FILTERS = { maxPrice: 10, vehicleSize: '', minRating: 0 }
const LIBRARIES       = ['places']

export default function SearchSpots() {
  const [spots, setSpots]     = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [center, setCenter]   = useState(DEFAULT_CENTER)
  const [mobileTab, setMobileTab] = useState('map') // 'map' | 'list'
  const [showFilters, setShowFilters] = useState(false)
  const autocompleteRef = useRef(null)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: LIBRARIES,
  })

  const fetchSpots = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        lat: center.lat, lng: center.lng,
        ...(filters.maxPrice < 10  && { maxPrice: filters.maxPrice }),
        ...(filters.vehicleSize    && { vehicleSize: filters.vehicleSize }),
        ...(filters.minRating > 0  && { minRating: filters.minRating }),
      }
      const res = await axios.get(`${API}/spots`, { params })
      setSpots(res.data)
    } catch {}
    setLoading(false)
  }, [center.lat, center.lng, filters.maxPrice, filters.vehicleSize, filters.minRating])

  useEffect(() => { fetchSpots() }, [fetchSpots])

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(pos =>
      setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude })
    )
  }, [])

  function handlePlaceChanged() {
    const place = autocompleteRef.current?.getPlace()
    if (place?.geometry?.location) {
      setCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      })
    }
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-0px)] md:h-[calc(100vh-65px)]">

      {/* Search bar — always visible */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-b border-black/10 flex-shrink-0">
        {isLoaded ? (
          <Autocomplete
            onLoad={a => (autocompleteRef.current = a)}
            onPlaceChanged={handlePlaceChanged}
            className="flex-1"
          >
            <input
              type="text"
              placeholder="Search any location…"
              className="w-full px-4 py-2.5 bg-paper rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 border border-black/10"
            />
          </Autocomplete>
        ) : (
          <div className="flex-1 px-4 py-2.5 bg-paper rounded-xl text-sm text-muted border border-black/10">
            Loading search…
          </div>
        )}
        <button
          onClick={() => setShowFilters(s => !s)}
          className={`flex-shrink-0 px-3 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${showFilters ? 'bg-ink text-paper border-ink' : 'bg-white border-black/10 text-ink'}`}
        >
          Filters {showFilters ? '↑' : '↓'}
        </button>
      </div>

      {/* Filter panel — collapsible */}
      {showFilters && (
        <div className="flex-shrink-0 bg-white border-b border-black/10 px-5 py-4">
          <FilterPanel filters={filters} onChange={setFilters} />
        </div>
      )}

      {/* Desktop 3-column / Mobile map+list toggle */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* Desktop: Filters sidebar */}
        <div className="hidden md:block w-56 flex-shrink-0 border-r border-black/10 bg-paper overflow-y-auto p-5">
          <div className="font-mono text-[11px] text-muted tracking-wider mb-1">FILTERS</div>
          <h2 className="text-lg font-bold mb-5">Refine</h2>
          <FilterPanel filters={filters} onChange={setFilters} />
          <div className="mt-6 p-4 bg-ink text-paper rounded-2xl">
            <div className="font-mono text-[10px] text-lime tracking-wider mb-1">RESULTS</div>
            <div className="font-mono text-2xl font-bold">{spots.length}</div>
            <div className="text-xs text-paper/60 mt-0.5">spots found</div>
          </div>
        </div>

        {/* Desktop: Cards list */}
        <div className="hidden md:block w-72 flex-shrink-0 border-r border-black/10 bg-white overflow-y-auto">
          <div className="p-4">
            <div className="text-xs text-muted mb-3">
              <strong className="text-ink">{spots.length}</strong> spots near this area
            </div>
            {loading
              ? <Loader size="sm" />
              : spots.length === 0
              ? <EmptyState icon="◻" title="No spots" message="Try adjusting filters or moving the map." />
              : <div className="flex flex-col gap-2">
                  {spots.map((s, i) => <SpotCard key={s.id} spot={s} index={i} />)}
                </div>
            }
          </div>
        </div>

        {/* Desktop: Map */}
        <div className="hidden md:block flex-1 relative">
          <MapView spots={spots} center={center} onCenterChange={setCenter} isLoaded={isLoaded} />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-ink/90 text-paper rounded-full font-mono text-[10px] tracking-wider pointer-events-none">
            ● MAP · {spots.length} SPOTS
          </div>
        </div>

        {/* Mobile: full-screen map or list */}
        <div className="md:hidden flex-1 relative flex flex-col">
          {mobileTab === 'map' ? (
            <div className="flex-1">
              <MapView spots={spots} center={center} onCenterChange={setCenter} isLoaded={isLoaded} />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto bg-white p-4">
              {loading
                ? <Loader size="sm" />
                : spots.length === 0
                ? <EmptyState icon="◻" title="No spots" message="Try adjusting filters or moving the map." />
                : <div className="flex flex-col gap-2">
                    {spots.map((s, i) => <SpotCard key={s.id} spot={s} index={i} />)}
                  </div>
              }
            </div>
          )}

          {/* Mobile tab toggle */}
          <div className="flex-shrink-0 flex bg-white border-t border-black/10">
            {[['map', '⊕ Map'], ['list', '≡ List']].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setMobileTab(tab)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${mobileTab === tab ? 'text-ink border-t-2 border-ink -mt-px' : 'text-muted'}`}
              >
                {label} {tab === 'list' && !loading ? `(${spots.length})` : ''}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
