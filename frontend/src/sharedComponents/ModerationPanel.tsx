import { moderatePalette } from '../api/moderatePalette'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useCallback, useState } from 'react'

import {
  MODERATION_STATUS,
  PERMISSION_LEVEL,
  type EModerationStatus,
} from '../types'

import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import { useTheme } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import { deletePalette } from '../api/palettes/deletePalette'
import { activeModalSignal } from '../signals'
import useGlobalStore from '../store'
import { BORDER_RADIUS, SPACING, subtleBackground } from '../styles/styleConsts'
import { MODAL_ID } from './Modal/Modal.types'

const ModerationPanel = ({
  refetch,
  moderationStatus,
  paletteId,
}: {
  refetch: () => void
  moderationStatus: EModerationStatus
  paletteId: string
}) => {
  const [isFetching, setIsFetching] = useState(false)
  const [shareToSocials, setShareToSocials] = useState(false)
  const appUserDetails = useGlobalStore((state) => state.appUserDetails)
  const theme = useTheme()

  const handleApprove = useCallback(async () => {
    setIsFetching(true)
    try {
      const response = await moderatePalette({
        paletteId,
        status: MODERATION_STATUS.APPROVED,
        shareToSocials,
      })
      if (response.success) {
        refetch?.()
      } else {
        alert('Failed to moderate palette')
      }
    } finally {
      // This shouldn't matter since refetch will clear it out.
      setIsFetching(false)
    }
  }, [paletteId, refetch, shareToSocials])

  const handleReject = useCallback(async () => {
    setIsFetching(true)
    try {
      const response = await moderatePalette({
        paletteId,
        status: MODERATION_STATUS.REJECTED,
      })
      if (response.success) {
        refetch?.()
      } else {
        alert('Failed to moderate palette')
      }
    } finally {
      // This shouldn't matter since refetch will clear it out.
      setIsFetching(false)
    }
  }, [paletteId, refetch])

  const handleDeleteCallback = useCallback(async () => {
    setIsFetching(true)
    const response = await deletePalette(paletteId)
    if (response.success) {
      alert('Palette deleted successfully')
      activeModalSignal.value = null
    } else {
      alert('Failed to delete palette')
    }
  }, [paletteId, setIsFetching])

  const handleDelete = useCallback(async () => {
    activeModalSignal.value = {
      id: MODAL_ID.CONFIRMATION_MODAL,
      overrideConfirmation: true,
      title: 'Delete Palette',
      body: 'Are you sure you want to delete this palette?',
      confirmationCallback: handleDeleteCallback,
      showCancel: true,
    }
  }, [handleDeleteCallback])

  if (
    !appUserDetails ||
    appUserDetails.permissionLevel < PERMISSION_LEVEL.MODERATOR
  ) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: SPACING.SMALL.PX,
        backgroundColor: subtleBackground(theme.palette.mode),
        borderRadius: BORDER_RADIUS.ZERO.PX,
        padding: SPACING.SMALL.PX,
      }}
    >
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={shareToSocials}
              onChange={() => setShareToSocials(!shareToSocials)}
            />
          }
          label="Share to socials"
        />
      </FormGroup>
      <Button
        variant="outlined"
        disabled={isFetching || moderationStatus === MODERATION_STATUS.APPROVED}
        onClick={handleApprove}
      >
        Approve
      </Button>
      <Button
        variant="outlined"
        disabled={isFetching || moderationStatus === MODERATION_STATUS.REJECTED}
        onClick={handleReject}
      >
        Reject
      </Button>
      <Button variant="outlined" disabled={isFetching} onClick={handleDelete}>
        Delete
      </Button>
    </Box>
  )
}

export default ModerationPanel
