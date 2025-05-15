'use client'

import { Box, Link, Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { FONT_SIZES, SPACING } from '../../../styles/Theme'
import { EModerationStatus, TPalette } from '../../../types'
import { getContrastColor } from '../../../utils'
import Message from '../../sharedComponents/Message'
import ModerationPanel from '../../sharedComponents/ModerationPanel'
import { blurHashToDataURL } from '../../../utils/blurhashToDataURL'

const PalettePage = ({ palette }: { palette: TPalette }) => {
  const router = useRouter()
  const refetch = useCallback(() => {
    router.refresh()
  }, [router])

  const blurDataURL = useMemo(() => blurHashToDataURL(palette.blurhash), [palette.blurhash])

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
          <Image
            placeholder="blur"
            style={{
              objectFit: 'contain',
              width: '100%',
              height: '100%',
              padding: SPACING.MEDIUM.PX,
            }}
            blurDataURL={blurDataURL}
            width={palette.aspectRatio * 1000}
            height={1000}
            src={palette.photoUrl}
            alt="Palette"
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            margin: '0 auto',
            width: '600px',
            '@media (max-width: 700px)': { width: '300px' },
          }}
        >
          {palette.colors.map((color: { id: string; hex: string }) => (
            <Box
              key={color.id}
              style={{
                backgroundColor: color.hex,
                height: '50px',
                width: '100px',
                display: 'flex',
                justifyContent: 'center',
                fontSize: '20px',
                alignItems: 'center',
                flexGrow: 1,
                color: getContrastColor(color.hex),
              }}
            >
              {color.hex}
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'baseline' }}>
          <Typography variant="h2" sx={{ fontSize: FONT_SIZES.HUGE.PX }}>
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
