'use client'

import { Box } from '@mui/material'
import Link from '../sharedComponents/Link'

const Footer = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: `20px 0`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
        }}
      >
        <Link target="_blank" href="https://discord.com/invite/J8jwMxEEff">
          Discord
        </Link>
        <Link target="_blank" href="https://bsky.app/profile/sillysideprojects.bsky.social">
          Bluesky
        </Link>
        <Link href="/donations">Donate</Link>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
        }}
      >
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/tos">Terms of Service</Link>
      </Box>
    </Box>
  )
}

export default Footer
