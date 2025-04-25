'use client'

import { Box } from '@mui/material'
import { useEffect } from 'react'
import { getMe } from '../../api/getMe'
import { createClient } from '../../services/supabase/client'
import useGlobalStore from '../../store'
import Loading from '../sharedComponents/Loading'

export function LoadUserIntoStore() {
  const supabase = createClient()
  const setAuthId = useGlobalStore(state => state.setAuthId)
  const isAppAuthenticating = useGlobalStore(state => state.isAppAuthenticating)
  const setIsAppAuthenticating = useGlobalStore(state => state.setIsAppAuthenticating)
  const setAppUserDetails = useGlobalStore(state => state.setAppUserDetails)

  useEffect(() => {
    if (!isAppAuthenticating) {
      return
    }

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setAuthId(user?.id ?? null)

      const userDetails = await getMe()

      if (userDetails) {
        setAppUserDetails({
          permissionLevel: userDetails.permission_level,
          displayName: userDetails.display_name,
          email: userDetails.email,
          id: userDetails.id,
        })
      }

      setIsAppAuthenticating(false)
    }

    loadUser()
  }, [setAuthId, supabase, setIsAppAuthenticating, isAppAuthenticating, setAppUserDetails])

  return isAppAuthenticating ? (
    <Box
      sx={{
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'fixed',
        backgroundColor: 'white',
        zIndex: 1000,
      }}
    >
      <Loading />
    </Box>
  ) : null
}
