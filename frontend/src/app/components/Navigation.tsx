'use client'

import { GiHamburgerMenu } from 'react-icons/gi'

import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import NextLink from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import useGlobalStore from '../../store'
import { PALETTE } from '../../styles/Theme'
import { EPermissionLevel } from '../../types'
import Link from '../sharedComponents/Link'

type TRoute = {
  key: string
  href: string
  label: string
  permissionLevel?: EPermissionLevel
  showWhenLoggedIn?: boolean
}

const ROUTES: Record<string, TRoute> = {
  home: {
    key: 'home',
    href: '/',
    label: 'Home',
  },
  moderation: {
    key: 'moderation',
    href: '/moderation',
    label: 'Moderation',
  },
  profile: {
    key: 'profile',
    href: '/profile',
    label: 'Profile',
  },
  create: {
    key: 'create',
    href: '/create',
    label: 'Create',
  },
  feedback: {
    key: 'feedback',
    href: '/feedback',
    label: 'Feedback',
  },
  login: {
    key: 'login',
    href: '/login',
    label: 'Login',
  },
  signup: {
    key: 'signup',
    href: '/signup',
    label: 'Signup',
  },
  logout: {
    key: 'logout',
    href: '/logout',
    label: 'Logout',
  },
  privacyPolicy: {
    key: 'privacyPolicy',
    href: '/privacy',
    label: 'Privacy Policy',
  },
  termsOfService: {
    key: 'termsOfService',
    href: '/tos',
    label: 'Terms of Service',
  },
  voting: {
    key: 'voting',
    href: '/voting',
    label: 'New Features',
  },
}

const DropdownLinks = ({ onClose }: { onClose: () => void }) => {
  const appUserDetails = useGlobalStore(state => state.appUserDetails)

  const routeKeys = useMemo(() => {
    if (!appUserDetails)
      return [
        'home',
        'login',
        'signup',
        'feedback',
        'voting',
        'privacyPolicy',
        'termsOfService',
      ] as const

    if (appUserDetails.permissionLevel >= EPermissionLevel.MODERATOR)
      return [
        'home',
        'create',
        'voting',
        'moderation',
        'profile',
        'feedback',
        'logout',
        'privacyPolicy',
        'termsOfService',
      ] as const

    return [
      'home',
      'create',
      'voting',
      'profile',
      'feedback',
      'logout',
      'privacyPolicy',
      'termsOfService',
    ] as const
  }, [appUserDetails])

  return (
    <>
      {routeKeys.map(key => (
        <MenuItem key={key} onClick={onClose}>
          <Link href={ROUTES[key].href}>{ROUTES[key].label}</Link>
        </MenuItem>
      ))}
    </>
  )
}

const Navigation = () => {
  const appUserDetails = useGlobalStore(state => state.appUserDetails)

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
        alignItems: 'center',
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
        {appUserDetails && (
          <NextLink
            style={{
              backgroundColor: PALETTE.secondary[400],
              color: PALETTE.grayscale[900],
              padding: '10px',
              borderRadius: 10,
            }}
            href={ROUTES.create.href}
          >
            {ROUTES.create.label}
          </NextLink>
        )}
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
          <DropdownLinks onClose={handleClose} />
        </Menu>
      </Box>
    </Box>
  )
}

export default Navigation
