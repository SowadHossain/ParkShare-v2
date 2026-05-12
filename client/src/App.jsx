import { createBrowserRouter } from 'react-router-dom'

// Public
import PublicLayout from './portals/Public/PublicLayout.jsx'
import Home from './portals/Public/pages/Home.jsx'
import About from './portals/Public/pages/About.jsx'
import HowItWorks from './portals/Public/pages/HowItWorks.jsx'
import Login from './portals/Public/pages/Login.jsx'
import Register from './portals/Public/pages/Register.jsx'
import ForgotPassword from './portals/Public/pages/ForgotPassword.jsx'
import AuthCallback from './portals/Public/pages/AuthCallback.jsx'
import NotFound from './portals/Public/pages/NotFound.jsx'

// Driver
import DriverLayout from './portals/Driver/DriverLayout.jsx'
import DriverWelcome from './portals/Driver/pages/Welcome.jsx'
import DriverDashboard from './portals/Driver/pages/Dashboard.jsx'
import SearchSpots from './portals/Driver/pages/SearchSpots.jsx'
import DriverSpotDetails from './portals/Driver/pages/SpotDetails.jsx'
import BookSpot from './portals/Driver/pages/BookSpot.jsx'
import CheckoutReview from './portals/Driver/pages/CheckoutReview.jsx'
import Payment from './portals/Driver/pages/Payment.jsx'
import PaymentSuccess from './portals/Driver/pages/PaymentSuccess.jsx'
import PaymentFailed from './portals/Driver/pages/PaymentFailed.jsx'
import BookingHistory from './portals/Driver/pages/BookingHistory.jsx'
import BookingDetails from './portals/Driver/pages/BookingDetails.jsx'
import CancelBooking from './portals/Driver/pages/CancelBooking.jsx'
import CancellationDone from './portals/Driver/pages/CancellationDone.jsx'
import WriteReview from './portals/Driver/pages/WriteReview.jsx'
import ReviewDone from './portals/Driver/pages/ReviewDone.jsx'
import DriverNotifications from './portals/Driver/pages/Notifications.jsx'
import DriverProfile from './portals/Driver/pages/Profile.jsx'
import DriverEditProfile from './portals/Driver/pages/EditProfile.jsx'
import DriverSettings from './portals/Driver/pages/Settings.jsx'

// Host
import HostLayout from './portals/Host/HostLayout.jsx'
import HostWelcome from './portals/Host/pages/Welcome.jsx'
import HostDashboard from './portals/Host/pages/Dashboard.jsx'
import MySpots from './portals/Host/pages/MySpots.jsx'
import AddSpotLocation from './portals/Host/pages/AddSpotLocation.jsx'
import AddSpotDetails from './portals/Host/pages/AddSpotDetails.jsx'
import AddSpotPricing from './portals/Host/pages/AddSpotPricing.jsx'
import AddSpotReview from './portals/Host/pages/AddSpotReview.jsx'
import SpotPublished from './portals/Host/pages/SpotPublished.jsx'
import EditSpot from './portals/Host/pages/EditSpot.jsx'
import HostSpotDetails from './portals/Host/pages/SpotDetails.jsx'
import DeleteSpot from './portals/Host/pages/DeleteSpot.jsx'
import HostBookings from './portals/Host/pages/HostBookings.jsx'
import HostBookingDetails from './portals/Host/pages/BookingDetails.jsx'
import HostWriteReview from './portals/Host/pages/WriteReview.jsx'
import Earnings from './portals/Host/pages/Earnings.jsx'
import TransactionDetails from './portals/Host/pages/TransactionDetails.jsx'
import HostNotifications from './portals/Host/pages/Notifications.jsx'
import HostProfile from './portals/Host/pages/Profile.jsx'
import HostEditProfile from './portals/Host/pages/EditProfile.jsx'
import HostSettings from './portals/Host/pages/Settings.jsx'

// Admin
import AdminLayout from './portals/Admin/AdminLayout.jsx'
import AdminDashboard from './portals/Admin/pages/Dashboard.jsx'
import ModerationUsers from './portals/Admin/pages/ModerationUsers.jsx'
import ModerationSpots from './portals/Admin/pages/ModerationSpots.jsx'
import ModerationReviews from './portals/Admin/pages/ModerationReviews.jsx'
import AdminUserDetails from './portals/Admin/pages/UserDetails.jsx'
import AdminSpotDetails from './portals/Admin/pages/SpotDetails.jsx'

const router = createBrowserRouter([
  // ── Public ────────────────────────────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/how-it-works', element: <HowItWorks /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/auth/callback', element: <AuthCallback /> },
    ],
  },

  // ── Driver ────────────────────────────────────────────────────────────
  {
    path: '/driver',
    element: <DriverLayout />,
    children: [
      { path: 'welcome', element: <DriverWelcome /> },
      { path: 'dashboard', element: <DriverDashboard /> },
      { path: 'search', element: <SearchSpots /> },
      { path: 'spots/:id', element: <DriverSpotDetails /> },
      { path: 'spots/:id/book', element: <BookSpot /> },
      { path: 'checkout/:bookingId', element: <CheckoutReview /> },
      { path: 'checkout/:bookingId/pay', element: <Payment /> },
      { path: 'checkout/:bookingId/success', element: <PaymentSuccess /> },
      { path: 'checkout/:bookingId/failed', element: <PaymentFailed /> },
      { path: 'bookings', element: <BookingHistory /> },
      { path: 'bookings/:id', element: <BookingDetails /> },
      { path: 'bookings/:id/cancel', element: <CancelBooking /> },
      { path: 'bookings/:id/cancel/done', element: <CancellationDone /> },
      { path: 'bookings/:id/review', element: <WriteReview /> },
      { path: 'bookings/:id/review/done', element: <ReviewDone /> },
      { path: 'notifications', element: <DriverNotifications /> },
      { path: 'profile', element: <DriverProfile /> },
      { path: 'profile/edit', element: <DriverEditProfile /> },
      { path: 'settings', element: <DriverSettings /> },
    ],
  },

  // ── Host ──────────────────────────────────────────────────────────────
  {
    path: '/host',
    element: <HostLayout />,
    children: [
      { path: 'welcome', element: <HostWelcome /> },
      { path: 'dashboard', element: <HostDashboard /> },
      { path: 'spots', element: <MySpots /> },
      { path: 'spots/new/location', element: <AddSpotLocation /> },
      { path: 'spots/new/details', element: <AddSpotDetails /> },
      { path: 'spots/new/pricing', element: <AddSpotPricing /> },
      { path: 'spots/new/review', element: <AddSpotReview /> },
      { path: 'spots/new/published', element: <SpotPublished /> },
      { path: 'spots/:id/edit', element: <EditSpot /> },
      { path: 'spots/:id', element: <HostSpotDetails /> },
      { path: 'spots/:id/delete', element: <DeleteSpot /> },
      { path: 'bookings', element: <HostBookings /> },
      { path: 'bookings/:id', element: <HostBookingDetails /> },
      { path: 'bookings/:id/review', element: <HostWriteReview /> },
      { path: 'earnings', element: <Earnings /> },
      { path: 'earnings/:txId', element: <TransactionDetails /> },
      { path: 'notifications', element: <HostNotifications /> },
      { path: 'profile', element: <HostProfile /> },
      { path: 'profile/edit', element: <HostEditProfile /> },
      { path: 'settings', element: <HostSettings /> },
    ],
  },

  // ── Admin ─────────────────────────────────────────────────────────────
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'users', element: <ModerationUsers /> },
      { path: 'users/:id', element: <AdminUserDetails /> },
      { path: 'spots', element: <ModerationSpots /> },
      { path: 'spots/:id', element: <AdminSpotDetails /> },
      { path: 'reviews', element: <ModerationReviews /> },
    ],
  },

  { path: '*', element: <NotFound /> },
])

export default router
