import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Browse from '../pages/Browse'
import TermsOfService from '../pages/TermsOfService'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import Changelog from '../pages/Changelog'
import Feedback from '../pages/Feedback'
import { Create, CreateLite } from '../pages/Create'
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
import Favorites from '../pages/Favorites'
import { ROUTES } from '../consts'

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
    <Route path={ROUTES.tos.href} element={<TermsOfService />} />
    <Route path={ROUTES.privacy.href} element={<PrivacyPolicy />} />
    <Route path={ROUTES.changelog.href} element={<Changelog />} />
    <Route path={ROUTES.feedback.href} element={<Feedback />} />

    <Route path={ROUTES.featureRequests.href} element={<FeatureRequests />} />
    <Route path={`${ROUTES.profile.href}/:id`} element={<Profile />} />
    <Route path={ROUTES.donate.href} element={<Donations />} />
    <Route path={'palette/:id'} element={<Palette />} />

    {/* Moderation only Routes */}
    <Route element={<ModerationRoute />}>
      <Route path={ROUTES.moderation.href} element={<Moderation />} />
    </Route>

    {/* Public only Routes */}
    <Route element={<PublicRoute />}>
      <Route path={ROUTES.createLite.href} element={<CreateLite />} />
      <Route path={ROUTES.login.href} element={<Login />} />
      <Route path={ROUTES.signup.href} element={<Signup />} />
    </Route>

    {/* Protected routes */}
    <Route element={<PrivateRoute />}>
      <Route path={ROUTES.create.href} element={<Create />} />
      <Route path={ROUTES.logout.href} element={<Logout />} />
      <Route path={ROUTES.profile.href} element={<Profile />} />
      <Route path={ROUTES.favorites.href} element={<Favorites />} />
    </Route>

    <Route path={ROUTES.error500.href} element={<Error500 />} />
    <Route path={ROUTES.error404.href} element={<Error404 />} />
    <Route path="*" element={<Error404 />} />
  </Routes>
)

export default Router
