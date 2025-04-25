'use client'

import { Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { logout } from '../../services/supabase/actions'
import useGlobalStore from '../../store'
export default function LogoutPage() {
  const router = useRouter()
  const setAuthId = useGlobalStore(state => state.setAuthId)
  const setAppUserDetails = useGlobalStore(state => state.setAppUserDetails)

  useEffect(() => {
    const logoutUser = async () => {
      setAuthId(null)
      setAppUserDetails(null)
      const response = await logout()
      if (response?.success) {
        router.push('/')
      }
    }
    logoutUser()
  }, [router, setAuthId, setAppUserDetails])

  return <Box>Logging out...</Box>
}
