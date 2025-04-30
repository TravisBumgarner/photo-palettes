'use client'

import { Box, Button, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { moderatePalette } from '../../../api/moderatePalette'
import { getPaletteById } from '../../../api/palettes/getById'
import { logger } from '../../../services/logging'
import useGlobalStore from '../../../store'
import { EModerationStatus, EPermissionLevel } from '../../../types'
import { getContrastColor } from '../../../utils'
import ErrorMessage from '../../sharedComponents/ErrorMessage'
import InfoMessage from '../../sharedComponents/InfoMessage'
import Loading from '../../sharedComponents/Loading'

const ModerationPanel = ({ paletteId }: { paletteId: string }) => {
  const appUserDetails = useGlobalStore(state => state.appUserDetails)
  const addAlert = useGlobalStore(state => state.addAlert)
  const handleReject = useCallback(async () => {
    const response = await moderatePalette(paletteId, EModerationStatus.REJECTED)
    if (response.success) {
      addAlert('Palette rejected')
    } else {
      addAlert(response.error)
    }
  }, [paletteId, addAlert])
  if (!appUserDetails) return null

  if (appUserDetails.permissionLevel >= EPermissionLevel.MODERATOR) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px', border: '4px solid red' }}>
        <Typography>Moderation Panel</Typography>
        <Button onClick={handleReject}>Reject</Button>
      </Box>
    )
  }

  return <Box></Box>
}

const PalettePage = () => {
  const params = useParams()
  const paletteId = params.id as string

  const { data, isLoading, error } = useQuery({
    queryKey: ['palette', paletteId],
    queryFn: () => getPaletteById(paletteId),
    retry: false,
  })

  useEffect(() => {
    if (error) logger.error(error)
  }, [error])

  if (isLoading || !data) return <Loading />

  if (error) return <ErrorMessage />

  if (!data.success) return <ErrorMessage error={data.error} />

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
      {data.palette.moderationStatus === EModerationStatus.AWAITING_MODERATION && (
        <InfoMessage info="This palette is pending approval." />
      )}
      <Box sx={{ maxWidth: '1000px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          style={{ maxWidth: '100%', maxHeight: '900px' }}
          src={data.palette.photoUrl}
          alt="Palette"
        />
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
          {data.palette.colors.map((color: { id: string; hex: string }) => (
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
        <Typography variant="h1">{data.palette.name}</Typography>
        <ModerationPanel paletteId={paletteId} />
      </Box>
    </Box>
  )
}

export default PalettePage
