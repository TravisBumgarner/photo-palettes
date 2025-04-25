'use client'

import { Box } from '@mui/material'
import useGlobalStore from '../../store'
import { EPermissionLevel } from '../../types'
import Link from '../sharedComponents/Link'

const AuthLinks = () => {
  const appUserDetails = useGlobalStore(state => state.appUserDetails)

  const routes = {
    public: [] as { key: string; href: string; label: string }[],
    loggedOut: [
      { key: 'login', href: '/login', label: 'Login' },
      { key: 'signup', href: '/signup', label: 'Signup' },
    ],
    member: [
      { key: 'browse', href: '/', label: 'Browse' },
      { key: 'create', href: '/create', label: 'Create' },
      { key: 'logout', href: '/logout', label: 'Logout' },
      { key: 'profile', href: '/profile', label: 'Profile' },
    ],
    moderator: [{ key: 'moderation', href: '/moderation', label: 'Moderation' }],
  }

  let availableRoutes = [...routes.public]

  if (!appUserDetails) {
    availableRoutes = [...availableRoutes, ...routes.loggedOut]
  } else {
    if (appUserDetails.permissionLevel >= EPermissionLevel.MEMBER) {
      availableRoutes = [...availableRoutes, ...routes.member]
    }
    if (appUserDetails.permissionLevel >= EPermissionLevel.MODERATOR) {
      availableRoutes = [...availableRoutes, ...routes.moderator]
    }
  }

  return (
    <>
      {availableRoutes.map(route => (
        <Link key={route.key} href={route.href}>
          {route.label}
        </Link>
      ))}
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
