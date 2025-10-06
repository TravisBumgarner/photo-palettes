import Box from '@mui/material/Box'
import { useTheme, type SxProps } from '@mui/material/styles'

import { useLocation } from 'react-router-dom'
import { ROUTES } from '../consts'
import { trackEvent } from '../services/analytics'
import Link from '../sharedComponents/Link'
import useGlobalStore from '../store'
import NavigationNative from './Navigation/Navigation.Native'
import NavigationWeb from './Navigation/Navigation.Web'

import { Capacitor } from '@capacitor/core'
import Tooltip from '@mui/material/Tooltip'
import { FaApple, FaFigma } from 'react-icons/fa'
import { IoLogoAndroid } from 'react-icons/io'
import {
  BORDER_RADIUS,
  DARK_BUTTON_STYLES,
  LIGHT_BUTTON_STYLES,
  SPACING,
} from '../styles/styleConsts'
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
          gap: SPACING.SMALL.PX,
          alignItems: 'center',
        }}
      >
        {!Capacitor.isNativePlatform() && (
          <>
            <Tooltip title="iOS App (iPhone & iPad)" arrow>
              <Box>
                <Link
                  hideBaseUnderline
                  hideHoverUnderline
                  href={ROUTES.apple.href}
                  target="_blank"
                >
                  <FaApple size={30} />
                </Link>
              </Box>
            </Tooltip>
            <Tooltip title="Android App" arrow>
              <Box>
                <Link
                  hideBaseUnderline
                  hideHoverUnderline
                  href={ROUTES.android.href}
                >
                  <IoLogoAndroid size={36} />
                </Link>
              </Box>
            </Tooltip>
            <Tooltip title="Figma Plugin" arrow>
              <Box>
                <Link
                  hideBaseUnderline
                  hideHoverUnderline
                  href={ROUTES.figma.href}
                  target="_blank"
                >
                  <FaFigma size={26} />
                </Link>
              </Box>
            </Tooltip>
          </>
        )}
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
        {Capacitor.isNativePlatform() ? (
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
