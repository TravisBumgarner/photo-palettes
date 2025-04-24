'use client'

import { Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { logout } from '../../services/supabase/actions'
import useGlobalStore from '../../store'
export default function LogoutPage() {
  const router = useRouter()
  const setAuthDetails = useGlobalStore(state => state.setAuthDetails)

  useEffect(() => {
    const logoutUser = async () => {
      setAuthDetails(null)
      const response = await logout()
      if (response?.success) {
        router.push('/')
      }
    }
    logoutUser()
  }, [router, setAuthDetails])

  return <Box>Logging out...</Box>
}
