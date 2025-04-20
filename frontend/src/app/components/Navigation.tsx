'use client'

import { Box } from '@mui/material'
import Link from 'next/link'
import useGlobalStore from '../../store'

const AuthLinks = () => {
  const user = useGlobalStore(state => state.user)

  return (
    <>
      {user ? (
        <Link href="/logout">Logout</Link>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
        </>
      )}
    </>
  )
}

const Navigation = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: `10px 20px`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '14px',
        }}
      >
        <Link href="/">Home</Link>
        <AuthLinks />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '14px',
        }}
      >
        <Link href="/donations">Donate</Link>
      </Box>
    </Box>
  )
}

export default Navigation
