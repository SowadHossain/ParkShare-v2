import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import { useCallback } from 'react'

export default function LocationPicker({ lat, lng, onChange }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  })

  const center = lat && lng ? { lat, lng } : { lat: 23.7937, lng: 90.4066 }

  const handleMapClick = useCallback(e => {
    onChange({ lat: e.latLng.lat(), lng: e.latLng.lng() })
  }, [onChange])

  if (!isLoaded) return (
    <div className="h-full flex items-center justify-center bg-paper2 rounded-2xl">
      <div className="font-mono text-xs text-muted">Loading map…</div>
    </div>
  )

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%', borderRadius: 16 }}
      center={center}
      zoom={15}
      onClick={handleMapClick}
      options={{ disableDefaultUI: false, zoomControl: true }}
    >
      {lat && lng && <Marker position={{ lat, lng }} />}
    </GoogleMap>
  )
}
