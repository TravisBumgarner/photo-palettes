import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

import { Capacitor } from '@capacitor/core'
import { ROUTES } from '../consts'
import Link from '../sharedComponents/Link'
import useGlobalStore from '../store'
import { FONT_SIZES, SPACING, subtleBackground } from '../styles/styleConsts'
import { PERMISSION_LEVEL, type EPermissionLevel } from '../types'

const Section = ({
  links,
  header,
}: {
  links: (keyof typeof ROUTES)[]
  header: string
}) => {
  return (
    <Box sx={{ width: '150px' }}>
      <Typography
        variant="h6"
        sx={{
          fontSize: FONT_SIZES.LARGE.PX,
          marginBottom: `${SPACING.TINY.PX}`,
        }}
      >
        {header}
      </Typography>
      <List sx={{ margin: 0, padding: 0 }}>
        {links.map((link) => (
          <ListItem
            key={link}
            sx={{
              margin: 0,
              padding: 0,
              fontSize: FONT_SIZES.MEDIUM.PX,
              listStyleType: 'none',
            }}
          >
            <Link hideBaseUnderline href={ROUTES[link].href}>
              {ROUTES[link].label}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

const getBasedOnPermissionLevel = (
  user: EPermissionLevel | undefined,
  loggedOut: (keyof typeof ROUTES)[],
  loggedIn: (keyof typeof ROUTES)[],
  moderator: (keyof typeof ROUTES)[]
) => {
  if (user === PERMISSION_LEVEL.MODERATOR || user === PERMISSION_LEVEL.ADMIN) {
    return moderator
  }

  if (user === PERMISSION_LEVEL.MEMBER) {
    return loggedIn
  }

  return loggedOut
}

const sections = (
  user: EPermissionLevel | undefined
): { header: string; links: (keyof typeof ROUTES)[] }[] => {
  return [
    {
      header: 'Community',
      links: ['discord', 'bluesky', 'twitter', 'instagram', 'donate'],
    },
    {
      header: 'Feedback',
      links: ['feedback', 'featureRequests'],
    },
    {
      header: 'Site Info',
      links: ['releaseNotes', 'privacy', 'tos'],
    },
    {
      header: 'User',
      links: getBasedOnPermissionLevel(
        user,
        ['login', 'signup'],
        ['profile', 'logout'],
        ['profile', 'moderation', 'logout']
      ),
    },
  ]
}

const Footer = () => {
  const appUser = useGlobalStore((state) => state.appUser)
  const theme = useTheme()
  if (Capacitor.isNativePlatform()) return null

  return (
    <Box
      sx={{
        borderColor: 'divider',
        padding: SPACING.MEDIUM.PX,
        marginTop: SPACING.MEDIUM.PX,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        backgroundColor: subtleBackground(theme.palette.mode),
      }}
    >
      {sections(appUser?.permissionLevel).map((section) => (
        <Section
          key={section.header}
          links={section.links}
          header={section.header}
        />
      ))}
    </Box>
  )
}

export default Footer
