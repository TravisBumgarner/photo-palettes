import { GiHamburgerMenu } from 'react-icons/gi'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import Divider from '@mui/material/Divider'
import React, { useCallback, useMemo, useState } from 'react'
import { ROUTES } from '../../consts'
import Link from '../../sharedComponents/Link'
import useGlobalStore from '../../store'
import { BORDER_RADIUS, SPACING } from '../../styles/styleConsts'
import { PERMISSION_LEVEL } from '../../types'
import {
  ADMIN_ROUTES,
  ANON_ROUTES,
  MODERATOR_ROUTES,
  USER_ROUTES,
} from './Navigation.shared'
import { iconMap } from '../../consts'
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'

const DrawerLinks = ({ onClose }: { onClose: () => void }) => {
  const appUser = useGlobalStore((state) => state.appUser)

  const userSpecificRouteKeys = useMemo(() => {
    if (!appUser) return ANON_ROUTES

    if (appUser.permissionLevel == PERMISSION_LEVEL.ADMIN) return ADMIN_ROUTES

    if (appUser.permissionLevel >= PERMISSION_LEVEL.MODERATOR)
      return MODERATOR_ROUTES

    return USER_ROUTES
  }, [appUser])

  const footerRoutes: (keyof typeof ROUTES)[] = [
    'feedback',
    'featureRequests',
    'donate',
    'releaseNotes',
    'privacy',
    'tos',
  ]

  const socialIcons: (keyof typeof ROUTES)[] = [
    'bluesky',
    'instagram',
    'discord',
    'twitter',
  ]

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        padding: SPACING.SMALL.PX,
        flexDirection: 'column',
      }}
    >
      <Box>
        <List sx={{ listStyle: 'none' }}>
          {userSpecificRouteKeys.map((key) =>
            key === 'divider' ? (
              <Divider key="divider" />
            ) : (
              <Link
                hideHoverUnderline
                hideBaseUnderline
                key={key}
                href={ROUTES[key].href}
              >
                <ListItem onClick={onClose}>{ROUTES[key].label}</ListItem>
              </Link>
            )
          )}
        </List>
      </Box>
      <Box>
        <List sx={{ listStyle: 'none' }}>
          {footerRoutes.map((key) => (
            <Link
              key={key}
              hideHoverUnderline
              hideBaseUnderline
              href={ROUTES[key].href}
            >
              <ListItem onClick={onClose}>{ROUTES[key].label}</ListItem>
            </Link>
          ))}
        </List>

        <List
          sx={{
            margin: 0,
            display: 'flex',
            listStyle: 'none',
          }}
        >
          {socialIcons.map((link) => (
            <ListItem key={link}>
              <Link hideBaseUnderline href={ROUTES[link].href}>
                {React.createElement(iconMap[link]!, { size: 24 })}
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  )
}

const Navigation = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleDrawerOpen = useCallback(() => {
    setDrawerOpen(true)
  }, [])

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false)
  }, [])

  return (
    <>
      <Tooltip title="Menu">
        <IconButton aria-label="menu" onClick={handleDrawerOpen}>
          <GiHamburgerMenu />
        </IconButton>
      </Tooltip>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: 'background.default',
              borderRadius: BORDER_RADIUS.ZERO.PX,
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)',
            },
          },
        }}
      >
        <Box sx={{ width: 220, height: '100%' }}>
          <DrawerLinks onClose={handleDrawerClose} />
        </Box>
      </Drawer>
    </>
  )
}

export default Navigation
