'use client'

import { Box, Link } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { SPACING } from '../../../styles/styleConsts'
import { EModerationStatus, TPalette } from '../../../types'
import { getContrastColor } from '../../../utils'
import Message from '../../_sharedComponents/Message'
import ModerationPanel from '../../_sharedComponents/ModerationPanel'
import { blurHashToDataURL } from '../../../utils/blurhashToDataURL'
import { PageTitle, PageWrapper } from '../../../styles/Shared'
import Share from '../../_sharedComponents/Share'

const PalettePage = ({ palette }: { palette: TPalette }) => {
  const router = useRouter()
  const refetch = useCallback(() => {
    router.refresh()
  }, [router])

  const blurDataURL = useMemo(() => blurHashToDataURL(palette.blurhash), [palette.blurhash])

  return (
    <PageWrapper width="full">
      {palette.moderationStatus === EModerationStatus.AWAITING_MODERATION && (
        <Message message="This palette is pending approval." color="info" />
      )}
      {palette.moderationStatus === EModerationStatus.REJECTED && (
        <Message message="This palette was rejected." color="error" />
      )}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: SPACING.MEDIUM.PX }}>
          <PageTitle text={palette.name} />
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'baseline' }}>
            {'By'}
            <Link href={`/profile/${palette.appUserId}`}>#{palette.appUserId.slice(0, 6)}</Link>
          </Box>
        </Box>
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
              padding: SPACING.SMALL.PX,
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
            '& > *': {
              flex: '1 0 16.66%', // 6 per row by default
              boxSizing: 'border-box',
            },
            '@media (max-width: 700px)': {
              '& > *': {
                flex: '1 0 33.33%', // 3 per row at <=700px
              },
            },
          }}
        >
          {palette.colors.map((color: { id: string; hex: string }) => (
            <Box
              key={color.id}
              style={{
                backgroundColor: color.hex,
                height: '50px',
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
      </Box>
      {palette.moderationStatus === EModerationStatus.APPROVED && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: SPACING.MEDIUM.PX }}>
          <Share
            url={`palette/${palette.id}`}
            text={`${palette.name} by #${palette.appUserId.slice(0, 6)}`}
            media={palette.ogPhotoUrl}
          />
        </Box>
      )}
      <ModerationPanel
        refetch={refetch}
        moderationStatus={palette.moderationStatus}
        paletteId={palette.id}
      />
    </PageWrapper>
  )
}

export default PalettePage
