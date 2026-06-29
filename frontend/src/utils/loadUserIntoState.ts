import posthog from 'posthog-js'
import getPaletteList from '../api/palettes/getPaletteList'
import { getMe } from '../api/user/getMe'
import config from '../config'
import { getUser } from '../services/supabase'
import useGlobalStore from '../store'

// Sets a person property used to target the PostHog "has palettes" survey.
// The check runs once per page load, so creating a palette mid-session does
// not flip the flag until the next reload — survey eligibility is locked in
// at load time by design.
const setHasPalettesProperty = async (userId: string) => {
  try {
    const response = await getPaletteList({
      size: 1,
      offset: 0,
      authorUserId: userId,
      sortBy: 'newest',
    })
    if (response.success) {
      posthog.setPersonProperties({ has_palettes: response.total >= 1 })
    }
  } catch {
    // Non-critical: survey targeting will simply be unavailable for this load.
  }
}

export const loadUserIntoState = async () => {
  const { user } = await getUser()
  let success: boolean = false

  const store = useGlobalStore.getState()

  if (user) {
    store.setAuthUser(user)
    const userDetails = await getMe()
    if (userDetails.success) {
      if (config.isProduction) {
        posthog.identify(userDetails.id)
        void setHasPalettesProperty(userDetails.id)
      }
      store.setAppUser(userDetails)
      success = true
    }
  }

  store.setLoadingUser(false)
  return success
}
