'use client'

import { Box, Link, Typography } from '@mui/material'
import Image from 'next/image'
import { ROUTES } from '../../consts'
import { PageTitle, PageWrapper } from '../../styles/Shared'
import AlphaSignup from '../sharedComponents/AlphaSignup'

const Inspired = () => {
  return (
    <Box>
      <PageTitle text="Join the Discussion" />
      <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center' }}>
        <li>
          <Link target="_blank" href={ROUTES.discord.href}>
            {ROUTES.discord.label}
          </Link>
        </li>
        <li>
          <Link target="_blank" href={ROUTES.bluesky.href}>
            {ROUTES.bluesky.label}
          </Link>
        </li>
      </ul>
    </Box>
  )
}

const Welcome = () => {
  return (
    <PageWrapper width="full">
      <Box>
        <PageTitle text="Welcome {appUserDetails ? appUserDetails.displayName : 'to Photo Palettes!'}" />
        <Typography variant="body1">
          A social platform for generating color palettes from photos.
        </Typography>
        <Typography variant="body1">
          Inspired by{' '}
          <Link target="_blank" href="https://seis.pointlessprojects.com">
            Seis Colores / Six Colors
          </Link>
          . Check out some of the examples below.
        </Typography>
        <Typography variant="body1">
          - Travis Bumgarner (
          <Link target="_blank" href="https://www.linkedin.com/in/travisbumgarner/">
            LinkedIn
          </Link>
          ,&nbsp;
          <Link target="_blank" href="https://travisbumgarner.dev">
            Portfolio
          </Link>
          )
        </Typography>
      </Box>
      <Box sx={{ width: '100%', aspectRatio: 16 / 9, position: 'relative' }}>
        <Image fill alt="color palette 1" src="/landing_page/1.png" />
      </Box>
      <AlphaSignup />
      <Box style={{ width: '100%', aspectRatio: 16 / 9, position: 'relative' }}>
        <Image fill alt="color palette 1" src="/landing_page/2.png" />
      </Box>
      <Inspired />
      <Box sx={{ width: '100%', aspectRatio: 16 / 9, position: 'relative' }}>
        <Image fill alt="color palette 1" src="/landing_page/3.png" />
      </Box>
    </PageWrapper>
  )
}

export default Welcome
