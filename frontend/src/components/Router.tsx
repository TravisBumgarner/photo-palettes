import { lazy } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Browse from '../pages/Browse'
const TermsOfService = lazy(async () => await import('../pages/TermsOfService'))
const PrivacyPolicy = lazy(async () => await import('../pages/PrivacyPolicy'))
const Changelog = lazy(async () => await import('../pages/Changelog'))
const Feedback = lazy(async () => await import('../pages/Feedback'))
const Create = lazy(async () => await import('../pages/Create/Create'))
// const CreateLite = lazy(async () => await import('../pages/Create/CreateLite'))
const Login = lazy(async () => await import('../pages/Login'))
const Error500 = lazy(async () => await import('../pages/Error500'))
const Error404 = lazy(async () => await import('../pages/Error404'))
const FeatureRequests = lazy(
  async () => await import('../pages/FeatureRequests')
)
const Signup = lazy(async () => await import('../pages/Signup'))
const Profile = lazy(async () => await import('../pages/Profile'))
const Logout = lazy(async () => await import('../pages/Logout'))
const Moderation = lazy(async () => await import('../pages/Moderation'))
const Donations = lazy(async () => await import('../pages/Donations'))
const Palette = lazy(async () => await import('../pages/Palette'))
const Favorites = lazy(async () => await import('../pages/Favorites'))

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
      <Route path="/favorites" element={<Favorites />} />
    </Route>

    <Route path="/error500" element={<Error500 />} />
    <Route path="/error404" element={<Error404 />} />
    <Route path="*" element={<Error404 />} />
  </Routes>
)

export default Router
