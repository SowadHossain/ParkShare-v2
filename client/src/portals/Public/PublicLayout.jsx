import { Outlet } from 'react-router-dom'
import { PublicNavbar } from '../../components/UI/Navbar.jsx'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
