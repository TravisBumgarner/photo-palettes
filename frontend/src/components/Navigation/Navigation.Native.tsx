import { GiHamburgerMenu } from 'react-icons/gi'
import { Box, IconButton, Drawer, MenuItem, Tooltip } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { ROUTES } from '../../consts'
import useGlobalStore from '../../store'
import { BORDER_RADIUS, SPACING } from '../../styles/styleConsts'
import { PERMISSION_LEVEL } from '../../types'
import Link from '../../sharedComponents/Link'
import { WrapperSX } from './Navigation.styles'

const DropdownLinks = ({ onClose }: { onClose: () => void }) => {
  const appUserDetails = useGlobalStore((state) => state.appUserDetails)

  const userSpecificRouteKeys = useMemo((): (keyof typeof ROUTES)[] => {
    if (!appUserDetails) return ['browse', 'login', 'signup']

    if (appUserDetails.permissionLevel >= PERMISSION_LEVEL.MODERATOR)
      return [
        'browse',
        'favorites',
        'profile',
        'moderation',
        'feedback',
        'logout',
      ]

    return ['browse', 'favorites', 'profile', 'feedback', 'logout']
  }, [appUserDetails])

  const boringRoutes: (keyof typeof ROUTES)[] = [
    'discord',
    'bluesky',
    'featureRequests',
    'changelog',
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
        {userSpecificRouteKeys.map((key) => (
          <Link key={key} hideUnderline href={ROUTES[key].href}>
            <MenuItem onClick={onClose}>{ROUTES[key].label}</MenuItem>
          </Link>
        ))}
      </Box>
      <Box>
        {boringRoutes.map((key) => (
          <Link key={key} hideUnderline href={ROUTES[key].href}>
            <MenuItem onClick={onClose}>{ROUTES[key].label}</MenuItem>
          </Link>
        ))}
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
    <Box sx={WrapperSX}>
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
          hideUnderline
          sx={{
            fontWeight: 900,
            backgroundColor: 'text.primary',
            color: 'background.paper',
            padding: '10px',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: BORDER_RADIUS.ZERO.PX,
          }}
          href={ROUTES.create.href}
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
