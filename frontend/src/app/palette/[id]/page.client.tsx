'use client'

import { Box, Button, Link, Typography } from '@mui/material'
import { useCallback } from 'react'
import { moderatePalette } from '../../../api/moderatePalette'
import useGlobalStore from '../../../store'
import { EModerationStatus, EPermissionLevel, TPalette } from '../../../types'
import { getContrastColor } from '../../../utils'
import ErrorMessage from '../../sharedComponents/ErrorMessage'
import InfoMessage from '../../sharedComponents/InfoMessage'

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

const PalettePage = ({ palette }: { palette: TPalette }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
      {palette.moderationStatus === EModerationStatus.AWAITING_MODERATION && (
        <InfoMessage info="This palette is pending approval." />
      )}
      {palette.moderationStatus === EModerationStatus.REJECTED && (
        <ErrorMessage error="This palette was rejected." />
      )}
      <Box sx={{ maxWidth: '1000px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          style={{ maxWidth: '100%', maxHeight: '900px' }}
          src={palette.photoUrl}
          alt="Palette"
        />
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
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
        <Typography variant="h1">{palette.name}</Typography>
        <Link href={`/profile/${palette.appUserId}`}>{palette.appUserId}</Link>
        <ModerationPanel paletteId={palette.id} />
      </Box>
    </Box>
  )
}

export default PalettePage
