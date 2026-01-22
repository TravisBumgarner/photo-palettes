import { lazy } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { ROUTES } from '../consts'
import Browse from '../pages/Browse'
import Settings from '../pages/Settings'
import useGlobalStore from '../store'
import { PERMISSION_LEVEL } from '../types'
const TermsOfService = lazy(async () => await import('../pages/TermsOfService'))
const PrivacyPolicy = lazy(async () => await import('../pages/PrivacyPolicy'))
const ReleaseNotes = lazy(async () => await import('../pages/ReleaseNotes'))
const Feedback = lazy(async () => await import('../pages/Feedback'))
const Create = lazy(async () => await import('../pages/Create/Create'))
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
const Admin = lazy(async () => await import('../pages/Admin'))
const PasswordReset = lazy(async () => await import('../pages/PasswordReset'))
const AndroidSignup = lazy(async () => await import('../pages/AndroidSignup'))
const About = lazy(async () => await import('../pages/About'))

const AnonymousRoute = () => {
  const appUser = useGlobalStore((state) => state.appUser)
  return !appUser ? <Outlet /> : <Navigate to="/" />
}

const MemberRoute = () => {
  const appUser = useGlobalStore((state) => state.appUser)
  return appUser ? <Outlet /> : <Navigate to="/login" />
}

const ModerationRoute = () => {
  const appUser = useGlobalStore((state) => state.appUser)
  return (appUser?.permissionLevel || PERMISSION_LEVEL.ANONYMOUS) >=
    PERMISSION_LEVEL.MODERATOR ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  )
}

const AdminRoute = () => {
  const appUser = useGlobalStore((state) => state.appUser)
  return (appUser?.permissionLevel || PERMISSION_LEVEL.ANONYMOUS) >=
    PERMISSION_LEVEL.ADMIN ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  )
}

const Router = () => (
  <Routes>
    <Route path="/" element={<Browse />} />
    <Route
      path={ROUTES.create.href}
      element={(() => {
        const appUser = useGlobalStore.getState().appUser
        return <Create mode={appUser ? 'full' : 'lite'} />
      })()}
    />
    <Route path={ROUTES.tos.href} element={<TermsOfService />} />
    <Route path={ROUTES.privacy.href} element={<PrivacyPolicy />} />
    <Route path={ROUTES.releaseNotes.href} element={<ReleaseNotes />} />
    <Route path={ROUTES.feedback.href} element={<Feedback />} />

    <Route path={ROUTES.featureRequests.href} element={<FeatureRequests />} />
    <Route path={`${ROUTES.profile.href}/:id`} element={<Profile />} />
    <Route path={ROUTES.donate.href} element={<Donations />} />
    <Route path={'palette/:id'} element={<Palette />} />
    <Route path={ROUTES.passwordReset.href} element={<PasswordReset />} />
    <Route path={ROUTES.android.href} element={<AndroidSignup />} />
    <Route path={ROUTES.about.href} element={<About />} />

    {/* Protected routes */}
    <Route element={<MemberRoute />}>
      <Route path={ROUTES.logout.href} element={<Logout />} />
      <Route path={ROUTES.profile.href} element={<Profile />} />
      <Route path={ROUTES.favorites.href} element={<Favorites />} />
      <Route path={ROUTES.settings.href} element={<Settings />} />
    </Route>

    {/* Public only Routes */}
    <Route element={<AnonymousRoute />}>
      <Route path={ROUTES.login.href} element={<Login />} />
      <Route path={ROUTES.signup.href} element={<Signup />} />
    </Route>

    {/* Moderation only Routes */}
    <Route element={<ModerationRoute />}>
      <Route path={ROUTES.moderation.href} element={<Moderation />} />
    </Route>

    {/* Admin only Routes */}
    <Route element={<AdminRoute />}>
      <Route path={ROUTES.admin.href} element={<Admin />} />
    </Route>

    <Route path={ROUTES.error500.href} element={<Error500 />} />
    <Route path={ROUTES.error404.href} element={<Error404 />} />
    <Route path="*" element={<Error404 />} />
  </Routes>
)

export default Router
