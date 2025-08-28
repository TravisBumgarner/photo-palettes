import { Capacitor } from '@capacitor/core'

import { GiHamburgerMenu } from 'react-icons/gi'

import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { ROUTES } from '../consts'
import useGlobalStore from '../store'
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '../styles/styleConsts'
import { PERMISSION_LEVEL } from '../types'
import Link from '../sharedComponents/Link'

const DropdownLinks = ({ onClose }: { onClose: () => void }) => {
  const appUserDetails = useGlobalStore((state) => state.appUserDetails)

  const routeKeys = useMemo((): (keyof typeof ROUTES)[] => {
    if (!appUserDetails) return ['login', 'signup', 'featureRequests']

    if (appUserDetails.permissionLevel >= PERMISSION_LEVEL.MODERATOR)
      return [
        'favorites',
        'profile',
        'moderation',
        'feedback',
        'featureRequests',
        'logout',
      ]

    return ['favorites', 'profile', 'feedback', 'featureRequests', 'logout']
  }, [appUserDetails])
  return (
    <>
      {routeKeys.map((key) => (
        <Link key={key} hideUnderline href={ROUTES[key].href}>
          <MenuItem onClick={onClose}>{ROUTES[key].label}</MenuItem>
        </Link>
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
        marginTop: SPACING.MEDIUM.PX,
        paddingBottom: SPACING.MEDIUM.PX,
        marginBottom: SPACING.MEDIUM.PX,
        alignItems: 'center',
        borderBottom: '2px solid',
        borderBottomColor: 'divider',
      }}
    >
      {Capacitor.isNativePlatform() && <Box></Box>}
      {!Capacitor.isNativePlatform() && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '14px',
          }}
        >
          <Link
            hideUnderline
            sx={{
              fontWeight: 900,
              color: 'text.primary',
              fontSize: FONT_SIZES.LARGE.PX,
            }}
            href={ROUTES.home.href}
          >
            <Typography variant="h1">
              {ROUTES.home.label}
              <sup
                style={{
                  fontSize: '10px',
                  position: 'relative',
                  top: '-5px',
                  left: '5px',
                }}
              >
                Alpha
              </sup>
            </Typography>
          </Link>
        </Box>
      )}

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
          <IconButton
            aria-label="menu"
            aria-controls={open ? 'navigation-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <GiHamburgerMenu />
          </IconButton>
        </Tooltip>
        <Menu
          slotProps={{ paper: { sx: { borderRadius: BORDER_RADIUS.ZERO.PX } } }}
          id="navigation-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <DropdownLinks onClose={handleClose} />
        </Menu>
      </Box>
    </Box>
  )
}

export default Navigation
