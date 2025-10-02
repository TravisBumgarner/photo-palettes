import Box from '@mui/material/Box'
import { useTheme, type SxProps } from '@mui/material/styles'

import { useLocation } from 'react-router-dom'
import { ROUTES } from '../consts'
import { trackEvent } from '../services/analytics'
import Link from '../sharedComponents/Link'
import useGlobalStore from '../store'
import NavigationWeb from './Navigation/Navigation.Web'
import NavigationNative from './Navigation/Navigation.Native'

import {
  BORDER_RADIUS,
  DARK_BUTTON_STYLES,
  LIGHT_BUTTON_STYLES,
  SPACING,
} from '../styles/styleConsts'
import { Capacitor } from '@capacitor/core'
const Header = () => {
  const appUser = useGlobalStore((state) => state.appUser)
  const location = useLocation()

  const theme = useTheme()

  return (
    <Box sx={WrapperSX}>
      <Link href={ROUTES.home.href} hideBaseUnderline>
        <img
          src="/public/favicon.png"
          style={{ width: '36px', height: '36px', display: 'block' }}
        />
      </Link>

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
          hideBaseUnderline
          hideHoverUnderline
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
        {!Capacitor.isNativePlatform() ? (
          <NavigationNative />
        ) : (
          <NavigationWeb />
        )}
      </Box>
    </Box>
  )
}

const createLinkSX = (theme: 'dark' | 'light'): SxProps => ({
  fontWeight: 900,
  textDecoration: 'none',
  backgroundColor:
    theme === 'dark'
      ? DARK_BUTTON_STYLES.background
      : LIGHT_BUTTON_STYLES.background,
  color: `${theme === 'dark' ? DARK_BUTTON_STYLES.color : LIGHT_BUTTON_STYLES.color} !important`, // Boo me.
  padding: SPACING.SMALL.PX,
  borderRadius: BORDER_RADIUS.ZERO.PX,
  '&:hover': {
    backgroundColor:
      theme === 'dark'
        ? DARK_BUTTON_STYLES.hoverBackground
        : LIGHT_BUTTON_STYLES.hoverBackground,
  },
})

const WrapperSX = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: SPACING.MEDIUM.PX,
  padding: `${SPACING.SMALL.PX} 0`,
}

export default Header
