'use client'

import { Box, useMediaQuery } from '@mui/material'
import { useEffect } from 'react'
import { getMe } from '../../api/getMe'
import { createClient } from '../../services/supabase/client'
import useGlobalStore from '../../store'
import { PALETTE } from '../../styles/styleConsts'
import Loading from '../_sharedComponents/Loading'

export function LoadUserIntoStore() {
  const supabase = createClient()
  const setAuthId = useGlobalStore(state => state.setAuthId)
  const triggerFetchUser = useGlobalStore(state => state.triggerFetchUser)
  const setTriggerFetchUser = useGlobalStore(state => state.setTriggerFetchUser)
  const setAppUserDetails = useGlobalStore(state => state.setAppUserDetails)

  useEffect(() => {
    if (!triggerFetchUser) {
      return
    }

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setAuthId(user?.id ?? null)

      const userDetails = await getMe()

      if (userDetails.success) {
        setAppUserDetails(userDetails)
      }

      setTriggerFetchUser(false)
    }

    loadUser()
  }, [setAuthId, supabase, setTriggerFetchUser, triggerFetchUser, setAppUserDetails])

  const isDark = useMediaQuery('(prefers-color-scheme: dark)')

  return triggerFetchUser ? (
    <Box
      sx={{
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'fixed',
        zIndex: 1000,
        backgroundColor: isDark ? PALETTE.grayscale[900] : PALETTE.grayscale[100],
      }}
    >
      <Loading />
    </Box>
  ) : null
}
