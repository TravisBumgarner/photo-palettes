import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../consts'
import { queries } from '../database'
import useGlobalStore from '../store'

// A user can create palettes while logged out and save them to IndexedDB while
// they sign up or login. Once they return to the app, check if they have temporary palettes.
// This functionality also executes when they use Login.tsx since Signup.tsx requires them to
// email confirm before they can sign in. The email link will auth them for the first time so this
// catch that.
const useCheckTemporaryPalettesAndRedirect = () => {
  const appUserDetails = useGlobalStore((state) => state.appUserDetails)
  const [hasTemporaryPalettes, setHasTemporaryPalettes] = useState(false)
  const [hasRedirected, setHasRedirected] = useState(false)
  const location = useLocation()

  const navigate = useNavigate()
  useEffect(() => {
    queries
      .getTemporaryPalettes()
      .then((palettes) => setHasTemporaryPalettes(palettes.length > 0))
  }, [])

  useEffect(() => {
    // Don't redirect if user is on password reset page
    if (location.pathname === ROUTES.passwordReset.href) {
      return
    }

    if (appUserDetails && hasTemporaryPalettes && !hasRedirected) {
      // There's a race condition that causes the navigation to not work when signing in.
      // The timeout gives a tick to the event loop, allowing the sign-in process to complete.
      setTimeout(() => {
        navigate(ROUTES.create.href, { replace: true })
      }, 0)
      setHasRedirected(true)
    }
  }, [
    appUserDetails,
    hasTemporaryPalettes,
    navigate,
    hasRedirected,
    location.pathname,
  ])
}

export default useCheckTemporaryPalettesAndRedirect
