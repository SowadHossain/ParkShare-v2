import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { DriverNavbar } from '../../components/UI/Navbar.jsx'
import Loader from '../../components/UI/Loader.jsx'

export default function DriverLayout() {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'driver') return <Navigate to={`/${user.role}/dashboard`} replace />
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <DriverNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
