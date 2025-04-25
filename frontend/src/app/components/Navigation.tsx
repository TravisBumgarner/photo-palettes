'use client'

import { GiHamburgerMenu } from 'react-icons/gi'

import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import { useCallback, useState } from 'react'
import useGlobalStore from '../../store'
import { EPermissionLevel } from '../../types'
import Link from '../sharedComponents/Link'

const AuthLinks = ({ onClose }: { onClose: () => void }) => {
  const appUserDetails = useGlobalStore(state => state.appUserDetails)

  const routes = {
    public: [] as { key: string; href: string; label: string }[],
    loggedOut: [
      { key: 'login', href: '/login', label: 'Login' },
      { key: 'signup', href: '/signup', label: 'Signup' },
    ],
    member: [
      { key: 'profile', href: '/profile', label: 'Profile' },
      { key: 'logout', href: '/logout', label: 'Logout' },
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
        <MenuItem key={route.key} onClick={onClose}>
          <Link href={route.href}>{route.label}</Link>
        </MenuItem>
      ))}
    </>
  )
}

const Navigation = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: `10px 0`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '14px',
        }}
      >
        <Link href="/">Photo Palettes</Link>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '14px' }}>
        <Link href="/create">Create</Link>
        <IconButton
          aria-label="menu"
          aria-controls={open ? 'navigation-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <GiHamburgerMenu />
        </IconButton>

        <Menu id="navigation-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
          <AuthLinks onClose={handleClose} />
        </Menu>
      </Box>
    </Box>
  )
}

export default Navigation
