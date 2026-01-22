import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import React from 'react'

import { Capacitor } from '@capacitor/core'
import { iconMap, ROUTES } from '../consts'
import Link from '../sharedComponents/Link'
import { FONT_SIZES, SPACING, subtleBackground } from '../styles/styleConsts'

const Section = ({
  links,
  header,
  direction,
}: {
  links: (keyof typeof ROUTES)[]
  header: string
  direction: 'row' | 'column'
}) => {
  return (
    <Box sx={{ width: '200px', marginBottom: SPACING.LARGE.PX }}>
      <Typography
        variant="h6"
        sx={{
          fontSize: FONT_SIZES.LARGE.PX,
          marginBottom: `${SPACING.TINY.PX}`,
        }}
      >
        {header}
      </Typography>
      <List
        sx={{
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: direction,
          gap: direction === 'row' ? SPACING.SMALL.PX : SPACING.TINY.PX,
        }}
      >
        {links.map((link) => (
          <ListItem
            key={link}
            sx={{
              margin: 0,
              padding: 0,
              fontSize: FONT_SIZES.MEDIUM.PX,
              listStyleType: 'none',
              width: 'auto',
              flex: 'none',
            }}
          >
            <Link hideBaseUnderline href={ROUTES[link].href}>
              {iconMap[link]
                ? React.createElement(iconMap[link]!, { size: 30 })
                : ROUTES[link].label}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

const Footer = () => {
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
      <Section
        direction="row"
        links={['discord', 'bluesky', 'twitter', 'instagram']}
        header={'Community'}
      />
      <Section
        direction="row"
        links={['android', 'apple', 'figma']}
        header={'Apps'}
      />
      <Section
        direction="column"
        links={['feedback', 'featureRequests', 'donate']}
        header={'Get Involved'}
      />
      <Section
        direction="column"
        links={['about', 'releaseNotes', 'privacy', 'tos']}
        header={'Site Info'}
      />
    </Box>
  )
}

export default Footer
