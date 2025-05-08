'use client'

import { Box, Link, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { FONT_SIZES, SPACING } from '../../../styles/Theme'
import { EModerationStatus, TPalette } from '../../../types'
import { getContrastColor } from '../../../utils'
import Message from '../../sharedComponents/Message'
import ModerationPanel from '../../sharedComponents/ModerationPanel'

const PalettePage = ({ palette }: { palette: TPalette }) => {
  const router = useRouter()
  const refetch = useCallback(() => {
    router.refresh()
  }, [router])

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
      <ModerationPanel
        refetch={refetch}
        moderationStatus={palette.moderationStatus}
        paletteId={palette.id}
      />

      {palette.moderationStatus === EModerationStatus.AWAITING_MODERATION && (
        <Message message="This palette is pending approval." color="info" />
      )}
      {palette.moderationStatus === EModerationStatus.REJECTED && (
        <Message message="This palette was rejected." color="error" />
      )}
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            width: '100%',
            height: '65dvh',
            margin: `${SPACING.MEDIUM.PX} 0`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            style={{
              objectFit: 'contain',
              width: '100%',
              height: '100%',
              padding: SPACING.MEDIUM.PX,
            }}
            src={palette.photoUrl}
            alt="Palette"
          />
        </Box>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {palette.colors.map((color: { id: string; hex: string }) => (
            <Box
              key={color.id}
              style={{
                backgroundColor: color.hex,
                height: '75px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexGrow: 1,
              }}
            >
              <Typography variant="body1" color={getContrastColor(color.hex)}>
                {color.hex}
              </Typography>
            </Box>
          ))}
        </div>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'baseline' }}>
          <Typography variant="h1" sx={{ fontSize: FONT_SIZES.HUGE.PX }}>
            {palette.name}
          </Typography>
          {'by'}
          <Link href={`/profile/${palette.appUserId}`}>#{palette.appUserId.slice(0, 6)}</Link>
        </Box>
      </Box>
    </Box>
  )
}

export default PalettePage
