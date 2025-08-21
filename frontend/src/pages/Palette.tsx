'use client'

import { Box, Link } from '@mui/material'
import { SPACING } from '../styles/styleConsts'
import { MODERATION_STATUS } from '../types'
import { getContrastColor } from '../utils'
import Message from '../sharedComponents/Message'
import ModerationPanel from '../sharedComponents/ModerationPanel'
import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'
import Share from '../sharedComponents/Share'
import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPaletteById } from '../api/palettes/getPaletteById'
import { useParams } from 'react-router-dom'
import Loading from '../sharedComponents/Loading'

const Palette = () => {
  const params = useParams()
  const refetch = useCallback(() => {
    location.reload()
  }, [])

  //   const blurDataURL = useMemo(
  //     () => blurHashToDataURL(palette.blurhash),
  //     [palette.blurhash]
  //   );

  const { data, isLoading, error } = useQuery({
    queryKey: ['palette', Array.isArray(params.id) ? params.id[0] : params.id],
    queryFn: () =>
      getPaletteById(Array.isArray(params.id) ? params.id[0] : params.id),
    retry: false,
  })
  console.log('ruda', isLoading, error, data)
  if (isLoading) {
    return <Loading />
  }

  if (!data?.success || error) {
    return (
      <Message
        color="error"
        message="Palette not found or an error occurred."
      />
    )
  }

  return (
    <PageWrapper width="full">
      {data.palette.moderationStatus ===
        MODERATION_STATUS.AWAITING_MODERATION && (
        <Message message="This palette is pending approval." color="info" />
      )}
      {data.palette.moderationStatus === MODERATION_STATUS.REJECTED && (
        <Message message="This palette was rejected." color="error" />
      )}
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            gap: SPACING.MEDIUM.PX,
          }}
        >
          <PageTitle text={data.palette.name} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              alignItems: 'baseline',
            }}
          >
            {'By'}
            <Link href={`/profile/${data.palette.appUserId}`}>
              #{data.palette.appUserId.slice(0, 6)}
            </Link>
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
          {/* <Image
            placeholder="blur"
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
              padding: SPACING.SMALL.PX,
            }}
            blurDataURL={blurDataURL}
            width={palette.aspectRatio * 1000}
            height={1000}
            src={palette.photoUrl}
            alt="Palette"
          /> */}
          <img
            src={data.palette.photoUrl}
            alt="Palette"
            style={{
              objectFit: 'contain',
              width: '100%',
              height: '100%',
              padding: SPACING.SMALL.PX,
            }}
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
          {data.palette.colors.map((color: { id: string; hex: string }) => (
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
      {data.palette.moderationStatus === MODERATION_STATUS.APPROVED && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: SPACING.MEDIUM.PX,
          }}
        >
          <Share
            url={`palette/${data.palette.id}`}
            text={`${data.palette.name} by #${data.palette.appUserId.slice(
              0,
              6
            )}`}
            media={data.palette.ogPhotoUrl}
          />
        </Box>
      )}
      <ModerationPanel
        refetch={refetch}
        moderationStatus={data.palette.moderationStatus}
        paletteId={data.palette.id}
      />
    </PageWrapper>
  )
}

export default Palette
