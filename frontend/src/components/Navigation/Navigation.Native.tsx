import { GiHamburgerMenu } from 'react-icons/gi'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'

import Divider from '@mui/material/Divider'
import { useCallback, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '../../consts'
import { trackEvent } from '../../services/analytics'
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
import { createLinkSX, WrapperSX } from './Navigation.styles'

const DropdownLinks = ({ onClose }: { onClose: () => void }) => {
  const appUserDetails = useGlobalStore((state) => state.appUserDetails)

  const userSpecificRouteKeys = useMemo(() => {
    if (!appUserDetails) return ANON_ROUTES

    if (appUserDetails.permissionLevel == PERMISSION_LEVEL.ADMIN)
      return ADMIN_ROUTES

    if (appUserDetails.permissionLevel >= PERMISSION_LEVEL.MODERATOR)
      return MODERATOR_ROUTES

    return USER_ROUTES
  }, [appUserDetails])

  const boringRoutes: (keyof typeof ROUTES)[] = [
    'discord',
    'bluesky',
    'featureRequests',
    'releaseNotes',
    'donate',
    'privacy',
    'tos',
  ]
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
      }}
    >
      <Box>
        {userSpecificRouteKeys.map((key) =>
          key === 'divider' ? (
            <Divider key="divider" />
          ) : (
            <Link key={key} hideBaseUnderline href={ROUTES[key].href}>
              <MenuItem onClick={onClose}>{ROUTES[key].label}</MenuItem>
            </Link>
          )
        )}
      </Box>
      <Box>
        {boringRoutes.map((key) => (
          <Link key={key} hideBaseUnderline href={ROUTES[key].href}>
            <MenuItem onClick={onClose}>{ROUTES[key].label}</MenuItem>
          </Link>
        ))}
      </Box>
    </Box>
  )
}

const Navigation = () => {
  const appUserDetails = useGlobalStore((state) => state.appUserDetails)
  const location = useLocation()

  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleDrawerOpen = useCallback(() => {
    setDrawerOpen(true)
  }, [])

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false)
  }, [])

  const theme = useTheme()

  return (
    <Box sx={WrapperSX(theme.palette.mode)}>
      <Box />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: SPACING.MEDIUM.PX,
          alignItems: 'center',
        }}
      >
        <Link
          hideBaseUnderline
          hideHoverUnderline
          sx={createLinkSX(theme.palette.mode)}
          href={ROUTES.create.href}
          onClick={() => {
            if (location.pathname !== ROUTES.create.href) {
              trackEvent({
                event: 'create_button_clicked',
                properties: { mode: appUserDetails ? 'full' : 'lite' },
              })
            }
          }}
        >
          {ROUTES.create.label}
        </Link>
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
                borderRadius: BORDER_RADIUS.ZERO.PX,
                minWidth: 220,
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)',
              },
            },
          }}
        >
          <Box sx={{ width: 220, padding: 2, height: '100%' }}>
            <DropdownLinks onClose={handleDrawerClose} />
          </Box>
        </Drawer>
      </Box>
    </Box>
  )
}

export default Navigation
