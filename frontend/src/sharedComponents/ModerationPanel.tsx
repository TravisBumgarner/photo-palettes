import { moderatePalette } from '../api/moderatePalette'

import { useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import {
  MODERATION_STATUS,
  PERMISSION_LEVEL,
  type EModerationStatus,
} from '../types'

import { deletePalette } from '../api/palettes/deletePalette'
import useGlobalStore from '../store'
import { BORDER_RADIUS, SPACING } from '../styles/styleConsts'
import { activeModalSignal } from '../signals'
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
  const appUserDetails = useGlobalStore((state) => state.appUserDetails)
  const addAlert = useGlobalStore((store) => store.addAlert)
  const handleApprove = useCallback(async () => {
    setIsFetching(true)
    try {
      const response = moderatePalette(paletteId, MODERATION_STATUS.APPROVED)
      if ((await response).success) {
        refetch?.()
      } else {
        addAlert('Failed to moderate palette', 'error')
      }
    } finally {
      // This shouldn't matter since refetch will clear it out.
      setIsFetching(false)
    }
  }, [paletteId, refetch, addAlert])

  const handleReject = useCallback(async () => {
    setIsFetching(true)
    try {
      const response = await moderatePalette(
        paletteId,
        MODERATION_STATUS.REJECTED
      )
      if (response.success) {
        refetch?.()
      } else {
        addAlert('Failed to moderate palette', 'error')
      }
    } finally {
      // This shouldn't matter since refetch will clear it out.
      setIsFetching(false)
    }
  }, [paletteId, refetch, addAlert])

  const handleDeleteCallback = useCallback(async () => {
    setIsFetching(true)
    const response = await deletePalette(paletteId)
    if (response.success) {
      addAlert('Palette deleted successfully', 'success')
      activeModalSignal.value = null
    } else {
      addAlert('Failed to delete palette', 'error')
    }
  }, [paletteId, setIsFetching, addAlert])

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
        border: '2px solid',
        borderColor: 'divider',
        borderRadius: BORDER_RADIUS.ZERO.PX,
        padding: SPACING.SMALL.PX,
        margin: `${SPACING.LARGE.PX} 0`,
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
