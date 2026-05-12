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
  const [spots, setSpots]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [filters, setFilters]     = useState(DEFAULT_FILTERS)
  const [center, setCenter]       = useState(DEFAULT_CENTER)
  const [sheetOpen, setSheetOpen] = useState(false)
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

      {/* ── DESKTOP layout ── */}
      <div className="hidden md:flex flex-1 overflow-hidden min-h-0">
        {/* Filters sidebar */}
        <div className="w-56 flex-shrink-0 border-r border-black/10 bg-paper overflow-y-auto p-5">
          <div className="font-mono text-[11px] text-muted tracking-wider mb-1">FILTERS</div>
          <h2 className="text-lg font-bold mb-5">Refine</h2>
          <FilterPanel filters={filters} onChange={setFilters} />
          <div className="mt-6 p-4 bg-ink text-paper rounded-2xl">
            <div className="font-mono text-[10px] text-lime tracking-wider mb-1">RESULTS</div>
            <div className="font-mono text-2xl font-bold">{spots.length}</div>
            <div className="text-xs text-paper/60 mt-0.5">spots found</div>
          </div>
        </div>

        {/* Cards list */}
        <div className="w-72 flex-shrink-0 border-r border-black/10 bg-white overflow-y-auto">
          {/* Desktop search bar */}
          <div className="p-4 border-b border-black/10 sticky top-0 bg-white z-10">
            {isLoaded ? (
              <Autocomplete onLoad={a => (autocompleteRef.current = a)} onPlaceChanged={handlePlaceChanged} className="w-full">
                <input type="text" placeholder="Search any location…"
                  className="w-full px-4 py-2.5 bg-paper rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 border border-black/10" />
              </Autocomplete>
            ) : (
              <div className="px-4 py-2.5 bg-paper rounded-xl text-sm text-muted border border-black/10">Loading…</div>
            )}
          </div>
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

        {/* Map */}
        <div className="flex-1 relative">
          <MapView spots={spots} center={center} onCenterChange={setCenter} isLoaded={isLoaded} />
        </div>
      </div>

      {/* ── MOBILE layout: full-screen map + floating elements ── */}
      <div className="md:hidden flex-1 relative overflow-hidden">
        {/* Full-screen map */}
        <div className="absolute inset-0">
          <MapView spots={spots} center={center} onCenterChange={setCenter} isLoaded={isLoaded} />
        </div>

        {/* Floating search bar (glass) */}
        <div className="absolute top-4 left-4 right-4 z-20 flex gap-2">
          {isLoaded ? (
            <Autocomplete onLoad={a => (autocompleteRef.current = a)} onPlaceChanged={handlePlaceChanged} className="flex-1">
              <input type="text" placeholder="Search location…"
                className="w-full h-[52px] px-4 bg-white rounded-[18px] text-sm shadow-[0_6px_20px_rgba(0,0,0,0.12)] border-0 focus:outline-none focus:ring-2 focus:ring-ink/20"
                style={{ backdropFilter: 'blur(16px)' }}
              />
            </Autocomplete>
          ) : (
            <div className="flex-1 h-[52px] px-4 bg-white rounded-[18px] text-sm text-muted shadow-[0_6px_20px_rgba(0,0,0,0.12)] flex items-center">Loading…</div>
          )}
          <button onClick={() => setShowFilters(s => !s)}
            className={`w-[52px] h-[52px] rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.12)] flex items-center justify-center flex-shrink-0 transition-colors ${showFilters ? 'bg-ink text-paper' : 'bg-white text-ink'}`}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M2 5h14M5 9h8M7 13h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Filter chips row */}
        {showFilters && (
          <div className="absolute top-[76px] left-4 right-4 z-20">
            <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-4">
              <FilterPanel filters={filters} onChange={setFilters} />
            </div>
          </div>
        )}

        {/* Bottom sheet — spots list */}
        <div
          className="absolute left-0 right-0 z-10 transition-all duration-300 ease-out"
          style={{
            bottom: 0,
            height: sheetOpen ? '65%' : '130px',
            background: '#F6F4EE',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            boxShadow: '0 -20px 60px rgba(0,0,0,0.14)',
          }}
        >
          {/* Drag handle */}
          <button
            onClick={() => setSheetOpen(s => !s)}
            className="w-full pt-2 pb-1 flex flex-col items-center gap-1 focus:outline-none"
          >
            <div className="sheet-handle" />
          </button>

          {/* Sheet header */}
          <div className="px-5 pb-3 flex items-baseline justify-between">
            <div>
              <div className="text-[17px] font-bold leading-tight">
                {loading ? 'Searching…' : `${spots.length} spots nearby`}
              </div>
              <div className="text-xs text-muted mt-0.5">Sorted by distance</div>
            </div>
            <button onClick={() => setSheetOpen(s => !s)}
              className="font-mono text-[11px] text-muted tracking-wider">
              {sheetOpen ? 'Map ↓' : 'More ↑'}
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto" style={{ height: 'calc(100% - 84px)' }}>
            {/* Horizontal card scroll when collapsed */}
            {!sheetOpen && (
              <div className="flex gap-3 px-5 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
                {loading
                  ? <div className="flex-shrink-0 w-60 h-20 bg-paper2 rounded-2xl animate-pulse" />
                  : spots.slice(0, 8).map((s, i) => (
                      <div key={s.id} className="flex-shrink-0 w-60">
                        <SpotCard spot={s} index={i} compact />
                      </div>
                    ))
                }
              </div>
            )}

            {/* Vertical list when expanded */}
            {sheetOpen && (
              <div className="px-5 pb-28 flex flex-col gap-3">
                {loading
                  ? <Loader size="sm" />
                  : spots.length === 0
                  ? <EmptyState icon="◻" title="No spots" message="Try a different location." />
                  : spots.map((s, i) => <SpotCard key={s.id} spot={s} index={i} />)
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
