'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { logout } from '../../services/supabase/actions'
import useGlobalStore from '../../store'
import { Box } from '@mui/material'
export default function LogoutPage() {
  const router = useRouter()
  const setUser = useGlobalStore(state => state.setUser)

  useEffect(() => {
    const logoutUser = async () => {
      setUser(null)
      const response = await logout()
      if (response?.success) {
        router.push('/')
      }
    }
    logoutUser()
  }, [router, setUser])

  return <Box>Logging out...</Box>
}
