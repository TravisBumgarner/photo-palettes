'use client'

import { Box } from '@mui/material'
import { useEffect } from 'react'
import { createClient } from '../../services/supabase/client'
import useGlobalStore from '../../store'
import Loading from '../sharedComponents/Loading'

export function LoadUserIntoStore() {
  const supabase = createClient()
  const setAuthDetails = useGlobalStore(state => state.setAuthDetails)
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
      setAuthDetails(user)
      setIsAppAuthenticating(false)
    }

    loadUser()
  }, [setAuthDetails, supabase, setIsAppAuthenticating, isAppAuthenticating])

  return isAppAuthenticating ? (
    <Box
      sx={{
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'fixed',
        background: 'var(--background)',
      }}
    >
      <Loading />
    </Box>
  ) : null
}
