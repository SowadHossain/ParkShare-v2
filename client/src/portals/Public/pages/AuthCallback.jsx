import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { API } from '../../../context/AuthContext.jsx'
import axios from 'axios'
import Loader from '../../../components/UI/Loader.jsx'

export default function AuthCallback() {
  const [params] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    const role = params.get('role')
    if (!token) { navigate('/login?error=oauth'); return }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    axios.get(`${API}/auth/me`).then(res => {
      login(token, res.data)
      if (!res.data.onboarded) {
        navigate(`/${role || res.data.role}/welcome`)
      } else {
        navigate(`/${role || res.data.role}/dashboard`)
      }
    }).catch(() => navigate('/login?error=oauth'))
  }, [])

  return <Loader />
}
