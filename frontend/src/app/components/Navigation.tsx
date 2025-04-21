'use client'

import { Box } from '@mui/material'
import Link from 'next/link'
import useGlobalStore from '../../store'

const AuthLinks = () => {
  const user = useGlobalStore(state => state.user)

  return (
    <>
      {user ? (
        <>
          <Link href="/">Browse</Link>
          <Link href="/create">Create</Link>
          <Link href="/logout">Logout</Link>
        </>
      ) : (
        <>
          <Link href="/">Home</Link>
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
        <AuthLinks />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '14px',
        }}
      >
        <Link target="_blank" href="https://discord.com/invite/J8jwMxEEff">
          Discord
        </Link>
        <Link target="_blank" href="https://bsky.app/profile/sillysideprojects.bsky.social">
          Bluesky
        </Link>
        <Link href="/donations">Donate</Link>
      </Box>
    </Box>
  )
}

export default Navigation
