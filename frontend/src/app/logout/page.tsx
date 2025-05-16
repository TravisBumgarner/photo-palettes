'use client'

import { Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { logout } from '../../services/supabase/actions'
import useGlobalStore from '../../store'
import { PageTitle, PageWrapper } from '../../styles/Shared'
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

  return (
    <PageWrapper width="small">
      <PageTitle center text="Signing out..." />
      <Typography>See you soon!</Typography>
    </PageWrapper>
  )
}
