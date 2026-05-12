import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MAP_STYLE = [
  { featureType: 'all', stylers: [{ saturation: -20 }] },
  { featureType: 'road', stylers: [{ lightness: 20 }] },
]

export default function MapView({ spots = [], center, onCenterChange, isLoaded }) {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const mapCenter = center || { lat: 23.7937, lng: 90.4066 }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-paper2">
        <div className="font-mono text-xs text-muted">Loading map…</div>
      </div>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={mapCenter}
      zoom={15}
      options={{
        styles: MAP_STYLE,
        disableDefaultUI: false,
        zoomControl: true,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
      }}
      onDragEnd={map => {
        const c = map.getCenter()
        if (c && onCenterChange) onCenterChange({ lat: c.lat(), lng: c.lng() })
      }}
    >
      {spots.map(spot => (
        <Marker
          key={spot.id}
          position={{ lat: parseFloat(spot.latitude), lng: parseFloat(spot.longitude) }}
          onClick={() => setSelected(spot)}
          label={{
            text: `$${parseFloat(spot.hourly_price).toFixed(0)}`,
            color: '#0E0E0C',
            fontSize: '12px',
            fontWeight: '700',
            fontFamily: 'JetBrains Mono',
          }}
          icon={{
            path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
            fillColor: spot === selected ? '#C8FF3D' : '#FFFFFF',
            fillOpacity: 1,
            strokeColor: '#0E0E0C',
            strokeWeight: 2,
            scale: 1,
          }}
        />
      ))}
      {selected && (
        <InfoWindow
          position={{ lat: parseFloat(selected.latitude), lng: parseFloat(selected.longitude) }}
          onCloseClick={() => setSelected(null)}
        >
          <div style={{ fontFamily: 'DM Sans, sans-serif', minWidth: 180 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{selected.title}</div>
            <div style={{ fontSize: 11, color: '#8A8275', marginTop: 2 }}>{selected.address}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 16, fontWeight: 700, marginTop: 6 }}>
              ${parseFloat(selected.hourly_price).toFixed(2)}/hr
            </div>
            <div style={{ fontSize: 11, color: '#8A8275', marginTop: 2 }}>★ {parseFloat(selected.avg_rating || 0).toFixed(1)}</div>
            <button
              onClick={() => navigate(`/driver/spots/${selected.id}`)}
              style={{ marginTop: 8, width: '100%', padding: '6px', background: '#0E0E0C', color: '#F6F4EE', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              View details →
            </button>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}
