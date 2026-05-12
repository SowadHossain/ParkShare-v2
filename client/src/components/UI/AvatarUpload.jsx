import { useRef, useState } from 'react'
import axios from 'axios'
import { API } from '../../context/AuthContext.jsx'

export default function AvatarUpload({ user, onUploaded }) {
  const fileRef = useRef()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(user?.avatar_url || null)

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const form = new FormData()
      form.append('avatar', file)
      const { data } = await axios.post(`${API}/upload/avatar`, form)
      onUploaded?.(data.url)
    } finally {
      setUploading(false)
    }
  }

  const initial = user?.name?.[0]?.toUpperCase()

  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        onClick={() => fileRef.current.click()}
        className="relative w-20 h-20 rounded-full overflow-hidden bg-paper2 flex items-center justify-center flex-shrink-0 group focus:outline-none"
      >
        {preview
          ? <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
          : <span className="text-3xl font-bold text-ink">{initial}</span>
        }
        <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-paper text-xs font-semibold">{uploading ? '…' : 'Change'}</span>
        </div>
      </button>
      <div>
        <button
          type="button"
          onClick={() => fileRef.current.click()}
          disabled={uploading}
          className="text-sm font-semibold hover:opacity-60 transition-opacity disabled:opacity-40"
        >
          {uploading ? 'Uploading…' : 'Upload photo'}
        </button>
        <p className="text-xs text-muted mt-0.5">JPG or PNG · max 5 MB</p>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}
