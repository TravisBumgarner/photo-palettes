'use client'

import { Box, List, ListItem, Typography } from '@mui/material'
import { ROUTES } from '../../consts'
import useGlobalStore from '../../store'
import { FONT_SIZES, SPACING } from '../../styles/Theme'
import { EPermissionLevel } from '../../types'
import Link from '../sharedComponents/Link'
const Section = ({ links, header }: { links: (keyof typeof ROUTES)[]; header: string }) => {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontSize: FONT_SIZES.LARGE.PX, marginBottom: `${SPACING.TINY.PX}` }}
      >
        {header}
      </Typography>
      <List sx={{ margin: 0, padding: 0 }}>
        {links.map(link => (
          <ListItem key={link} sx={{ margin: 0, padding: 0, fontSize: FONT_SIZES.MEDIUM.PX }}>
            <Link hideUnderline href={ROUTES[link].href}>
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
  if (user === EPermissionLevel.MODERATOR || user === EPermissionLevel.ADMIN) {
    return moderator
  }

  if (user === EPermissionLevel.MEMBER) {
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
      links: ['discord', 'bluesky', 'donate'],
    },
    {
      header: 'Feedback',
      links: ['feedback', 'featureRequests'],
    },
    {
      header: 'Legal',
      links: ['privacy', 'tos'],
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
  const appUserDetails = useGlobalStore(state => state.appUserDetails)

  return (
    <Box
      sx={{
        backgroundColor: 'divider',
        padding: SPACING.MEDIUM.PX,
        display: 'flex',
        flexDirection: 'row',
        margin: `${SPACING.MEDIUM.PX} auto`,
        gap: `${SPACING.HUGE.PX}`,
        justifyContent: 'center',
      }}
    >
      {sections(appUserDetails?.permissionLevel).map(section => (
        <Section key={section.header} links={section.links} header={section.header} />
      ))}
    </Box>
  )
}

export default Footer
