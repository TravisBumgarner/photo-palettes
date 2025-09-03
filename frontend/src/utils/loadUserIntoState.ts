import { getMe } from '../api/getMe'
import { getUser } from '../services/supabase'
import useGlobalStore from '../store'

export const loadUserIntoState = async () => {
  const { user } = await getUser()
  let success: boolean = false

  const store = useGlobalStore.getState()

  if (user) {
    store.setAuthId(user.id)
    const userDetails = await getMe()
    if (userDetails.success) {
      store.setAppUserDetails(userDetails)
      success = true
    }
  }

  store.setLoadingUser(false)
  return success
}
