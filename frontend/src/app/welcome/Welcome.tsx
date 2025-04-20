'use client'

import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import useGlobalStore from '../../store'
import AlphaSignup from '../sharedComponents/AlphaSignup'
const linkStyle = {
  color: '#bd4e85',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}

const Inspired = () => {
  return (
    <Box>
      <Typography variant="h2" style={{ textAlign: 'center' }}>
        Follow the Journey
      </Typography>
      <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center' }}>
        <li>
          <a style={linkStyle} target="_blank" href="https://discord.com/invite/J8jwMxEEff">
            Join the Chat on Discord
          </a>
        </li>
        <li>
          <a
            style={linkStyle}
            target="_blank"
            href="https://bsky.app/profile/sillysideprojects.bsky.social"
          >
            Connect on Bluesky
          </a>
        </li>
      </ul>
    </Box>
  )
}

const Welcome = () => {
  const user = useGlobalStore(state => state.user)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        width: '100%',
        maxWidth: '800px',
        margin: '0px auto',
        padding: '20px',
        boxSizing: 'border-box',
        fontSize: '30px',
      }}
    >
      <Box>
        <Typography variant="h1">
          Welcome {user?.email ? user?.email : 'to Photo Palettes!'}
        </Typography>
        <Typography variant="body1">
          A social platform for generating color palettes from photos.
        </Typography>
        <Typography variant="body1">
          Inspired by{' '}
          <a style={linkStyle} target="_blank" href="https://seis.pointlessprojects.com">
            Seis Colores / Six Colors
          </a>
          . Check out some of the examples below.
        </Typography>
        <Typography variant="body1">
          - Travis Bumgarner (
          <a style={linkStyle} target="_blank" href="https://www.linkedin.com/in/travisbumgarner/">
            LinkedIn
          </a>
          ,&nbsp;
          <a style={linkStyle} target="_blank" href="https://travisbumgarner.dev">
            Portfolio
          </a>
          )
        </Typography>
      </Box>
      <Box sx={{ width: '100%', aspectRatio: 16 / 9, position: 'relative' }}>
        <Image fill alt="color palette 1" src="/landing_page/1.png" />
      </Box>
      <Box style={{ width: '100%', aspectRatio: 16 / 9, position: 'relative' }}>
        <Image fill alt="color palette 1" src="/landing_page/2.png" />
      </Box>
      <Box sx={{ width: '100%', aspectRatio: 16 / 9, position: 'relative' }}>
        <Image fill alt="color palette 1" src="/landing_page/3.png" />
      </Box>
      <AlphaSignup />
      <Inspired />
    </Box>
  )
}

export default Welcome
