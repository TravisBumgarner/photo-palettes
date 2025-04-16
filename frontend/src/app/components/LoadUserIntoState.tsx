'use client'

import { useEffect } from 'react'
import { createClient } from '../../services/supabase/client'
import useGlobalStore from '../../store'
import Loading from '../sharedComponents/Loading'

export function LoadUserIntoStore() {
  const supabase = createClient()
  const setUser = useGlobalStore(state => state.setUser)
  const isAppAuthenticating = useGlobalStore(state => state.isAppAuthenticating)
  const setIsAppAuthenticating = useGlobalStore(state => state.setIsAppAuthenticating)

  useEffect(() => {
    if (!isAppAuthenticating) {
      return
    }

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsAppAuthenticating(false)
    }

    loadUser()
  }, [setUser, supabase, setIsAppAuthenticating, isAppAuthenticating])

  return isAppAuthenticating ? (
    <div
      style={{
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'fixed',
        background: 'white',
      }}
    >
      <Loading />
    </div>
  ) : null
}
