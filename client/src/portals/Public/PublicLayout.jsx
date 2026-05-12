import { Outlet, useLocation } from 'react-router-dom'
import { PublicNavbar } from '../../components/UI/Navbar.jsx'

export default function PublicLayout() {
  const { key } = useLocation()
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <PublicNavbar />
      <main className="flex-1">
        <div key={key} className="page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
