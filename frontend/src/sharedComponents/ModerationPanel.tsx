import { moderatePalette } from '../api/moderation/moderatePalette'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useCallback, useState } from 'react'

import {
  MODERATION_STATUS,
  PERMISSION_LEVEL,
  type EModerationStatus,
  type TPalette,
} from '../types'

import { useTheme } from '@mui/material/styles'
import { deletePalette } from '../api/palettes/deletePalette'
import { activeModalSignal } from '../signals'
import useGlobalStore from '../store'
import { BORDER_RADIUS, SPACING, subtleBackground } from '../styles/styleConsts'
import { MODAL_ID } from './Modal/Modal.consts'

const ModerationPanel = ({
  refetch,
  moderationStatus,
  palette,
}: {
  refetch: () => void
  moderationStatus: EModerationStatus
  palette: TPalette
}) => {
  const [isFetching, setIsFetching] = useState(false)
  const appUser = useGlobalStore((state) => state.appUser)
  const theme = useTheme()

  const handleShareToSocials = useCallback(() => {
    activeModalSignal.value = {
      id: MODAL_ID.SHARE_TO_SOCIALS_MODAL,
      palette,
    }
  }, [palette])

  const handleApprove = useCallback(async () => {
    setIsFetching(true)
    try {
      const response = await moderatePalette({
        paletteId: palette.id,
        status: MODERATION_STATUS.APPROVED,
      })
      if (response.success) {
        refetch?.()
      } else {
        alert('Failed to moderate palette') // eslint-disable-line
      }
    } finally {
      // This shouldn't matter since refetch will clear it out.
      setIsFetching(false)
    }
  }, [palette.id, refetch])

  const handleReject = useCallback(async () => {
    setIsFetching(true)
    try {
      const response = await moderatePalette({
        paletteId: palette.id,
        status: MODERATION_STATUS.REJECTED,
      })
      if (response.success) {
        refetch?.()
      } else {
        alert('Failed to moderate palette') // eslint-disable-line
      }
    } finally {
      // This shouldn't matter since refetch will clear it out.
      setIsFetching(false)
    }
  }, [palette.id, refetch])

  const handleDeleteCallback = useCallback(async () => {
    setIsFetching(true)
    const response = await deletePalette(palette.id)
    if (response.success) {
      alert('Palette deleted successfully') // eslint-disable-line
      activeModalSignal.value = null
    } else {
      alert('Failed to delete palette') // eslint-disable-line
    }
  }, [palette.id, setIsFetching])

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

  if (!appUser || appUser.permissionLevel < PERMISSION_LEVEL.MODERATOR) {
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
      <Button
        variant="outlined"
        disabled={isFetching || moderationStatus === MODERATION_STATUS.APPROVED}
        onClick={handleApprove}
      >
        Approve
      </Button>
      <Button
        variant="outlined"
        disabled={isFetching || moderationStatus !== MODERATION_STATUS.APPROVED}
        onClick={handleShareToSocials}
      >
        Share to socials
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
