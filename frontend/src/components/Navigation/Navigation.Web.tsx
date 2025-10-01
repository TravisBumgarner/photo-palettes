import { FaApple } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

import Divider from '@mui/material/Divider'
import { useCallback, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '../../consts'
import { trackEvent } from '../../services/analytics'
import Link from '../../sharedComponents/Link'
import useGlobalStore from '../../store'
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '../../styles/styleConsts'
import { PERMISSION_LEVEL } from '../../types'
import {
  ADMIN_ROUTES,
  ANON_ROUTES,
  MODERATOR_ROUTES,
  USER_ROUTES,
} from './Navigation.shared'
import { createLinkSX, WrapperSX } from './Navigation.styles'

const DropdownLinks = ({ onClose }: { onClose: () => void }) => {
  const appUser = useGlobalStore((state) => state.appUser)

  const routeKeys = useMemo(() => {
    if (!appUser) return ANON_ROUTES

    if (appUser.permissionLevel == PERMISSION_LEVEL.ADMIN) return ADMIN_ROUTES

    if (appUser.permissionLevel >= PERMISSION_LEVEL.MODERATOR)
      return MODERATOR_ROUTES

    return USER_ROUTES
  }, [appUser])
  return (
    <>
      {routeKeys.map((key, index) =>
        key === 'divider' ? (
          <Divider key={key + index} />
        ) : (
          <Link
            key={key}
            hideBaseUnderline
            hideHoverUnderline
            href={ROUTES[key].href}
          >
            <MenuItem onClick={onClose}>{ROUTES[key].label}</MenuItem>
          </Link>
        )
      )}
    </>
  )
}

const Navigation = () => {
  const appUser = useGlobalStore((state) => state.appUser)
  const location = useLocation()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const theme = useTheme()

  return (
    <Box sx={WrapperSX(theme.palette.mode)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '14px',
        }}
      >
        <Typography variant="h1" sx={{ fontSize: FONT_SIZES.LARGE.PX }}>
          <Link href={ROUTES.home.href} hideBaseUnderline>
            {ROUTES.home.label}
            <sup
              style={{
                fontSize: '10px',
                position: 'relative',
                top: '-5px',
                left: '5px',
              }}
            >
              Beta
            </sup>
          </Link>
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: SPACING.MEDIUM.PX,
          alignItems: 'center',
        }}
      >
        <Link
          sx={createLinkSX(theme.palette.mode)}
          href={ROUTES.create.href}
          onClick={() => {
            if (location.pathname !== ROUTES.create.href) {
              trackEvent({
                event: 'create_button_clicked',
                properties: { mode: appUser ? 'full' : 'lite' },
              })
            }
          }}
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
      <Box
        sx={{
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          zIndex: 999,
          backgroundColor: 'text.primary',
          '& svg': {
            fill: theme.palette.background.default,
          },
        }}
      >
        <Link
          href="https://testflight.apple.com/join/qxjus9mV"
          hideBaseUnderline
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: SPACING.SMALL.PX,
          }}
        >
          <FaApple color="background.primary" />
          <Typography
            sx={{
              fontWeight: 900,
              color: 'background.default',
              marginLeft: SPACING.SMALL.PX,
            }}
          >
            Join the Beta
          </Typography>
        </Link>
      </Box>
    </Box>
  )
}

export default Navigation
