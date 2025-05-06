'use client'

import { Box, Button, Link, Typography } from '@mui/material'
import { useCallback } from 'react'
import { moderatePalette } from '../../../api/moderatePalette'
import useGlobalStore from '../../../store'
import { FONT_SIZES, SPACING } from '../../../styles/Theme'
import { EModerationStatus, EPermissionLevel, TPalette } from '../../../types'
import { getContrastColor } from '../../../utils'
import Message from '../../sharedComponents/Message'
const ModerationPanel = ({ paletteId }: { paletteId: string }) => {
  const appUserDetails = useGlobalStore(state => state.appUserDetails)
  const addAlert = useGlobalStore(state => state.addAlert)
  const handleReject = useCallback(async () => {
    const response = await moderatePalette(paletteId, EModerationStatus.REJECTED)
    if (response.success) {
      addAlert('Palette rejected', 'success')
    } else {
      addAlert(response.error, 'error')
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
        <ModerationPanel paletteId={palette.id} />
      </Box>
    </Box>
  )
}

export default PalettePage
