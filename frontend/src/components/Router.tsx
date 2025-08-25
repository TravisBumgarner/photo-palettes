import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Browse from '../pages/Browse'
import TermsOfService from '../pages/TermsOfService'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import Changelog from '../pages/Changelog'
import Feedback from '../pages/Feedback'
import Create from '../pages/Create/Create'
import Login from '../pages/Login'
import Error500 from '../pages/Error500'
import Error404 from '../pages/Error404'
import FeatureRequests from '../pages/FeatureRequests'
import Signup from '../pages/Signup'
import Profile from '../pages/Profile'
import Logout from '../pages/Logout'
import Moderation from '../pages/Moderation'
import Donations from '../pages/Donations'
import Palette from '../pages/Palette'
import useGlobalStore from '../store'
import { PERMISSION_LEVEL } from '../types'

const PrivateRoute = () => {
  const appUserDetails = useGlobalStore((state) => state.appUserDetails)
  return appUserDetails ? <Outlet /> : <Navigate to="/login" />
}

const PublicRoute = () => {
  const appUserDetails = useGlobalStore((state) => state.appUserDetails)
  return !appUserDetails ? <Outlet /> : <Navigate to="/" />
}

const ModerationRoute = () => {
  const appUserDetails = useGlobalStore((state) => state.appUserDetails)
  return (appUserDetails?.permissionLevel || PERMISSION_LEVEL.VISITOR) >=
    PERMISSION_LEVEL.MODERATOR ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  )
}

const Router = () => (
  <Routes>
    <Route path="/" element={<Browse />} />
    <Route path="/tos" element={<TermsOfService />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />
    <Route path="/changelog" element={<Changelog />} />
    <Route path="/feedback" element={<Feedback />} />

    <Route path="/feature_requests" element={<FeatureRequests />} />
    <Route path="/profile/:id" element={<Profile />} />
    <Route path="/donations" element={<Donations />} />
    <Route path="/palette/:id" element={<Palette />} />

    {/* Moderation only Routes */}
    <Route element={<ModerationRoute />}>
      <Route path="/moderation" element={<Moderation />} />
    </Route>

    {/* Public only Routes */}
    <Route element={<PublicRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Route>

    {/* Protected routes */}
    <Route element={<PrivateRoute />}>
      <Route path="/create" element={<Create />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/profile" element={<Profile />} />
    </Route>

    <Route path="/error500" element={<Error500 />} />
    <Route path="/error404" element={<Error404 />} />
    <Route path="*" element={<Error404 />} />
  </Routes>
)

export default Router
