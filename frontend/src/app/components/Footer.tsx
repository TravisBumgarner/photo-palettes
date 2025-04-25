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
        margin: `20px 20px`,
      }}
    >
      <Box></Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '14px',
        }}
      >
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/tos">Terms of Service</Link>
      </Box>
    </Box>
  )
}

export default Footer
