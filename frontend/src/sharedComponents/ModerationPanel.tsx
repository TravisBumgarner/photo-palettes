import { moderatePalette } from '../api/moderatePalette'

import { useCallback, useState } from 'react'

import {
  PERMISSION_LEVEL,
  type EModerationStatus,
  MODERATION_STATUS,
} from '../types'

import { Box, Button } from '@mui/material'
import useGlobalStore from '../store'
import { BORDER_RADIUS, SPACING } from '../styles/styleConsts'
import { deletePalette } from '../api/palettes/deletePalette'

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
  const setActiveModal = useGlobalStore((state) => state.setActiveModal)

  const handleApprove = useCallback(async () => {
    setIsFetching(true)
    try {
      await moderatePalette(paletteId, MODERATION_STATUS.APPROVED)
      refetch?.()
    } finally {
      // This shouldn't matter since refetch will clear it out.
      setIsFetching(false)
    }
  }, [paletteId, refetch])

  const handleReject = useCallback(async () => {
    setIsFetching(true)
    try {
      await moderatePalette(paletteId, MODERATION_STATUS.REJECTED)
      refetch?.()
    } finally {
      // This shouldn't matter since refetch will clear it out.
      setIsFetching(false)
    }
  }, [paletteId, refetch])

  const handleDeleteCallback = useCallback(async () => {
    setIsFetching(true)
    await deletePalette(paletteId)
    refetch()
  }, [paletteId, refetch, setIsFetching])

  const handleDelete = useCallback(async () => {
    setActiveModal({
      id: 'ConfirmationModal',
      title: 'Delete Palette',
      body: 'Are you sure you want to delete this palette?',
      confirmationCallback: handleDeleteCallback,
      showCancel: true,
    })
  }, [handleDeleteCallback, setActiveModal])

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
        border: '4px solid',
        borderColor: 'red',
        borderRadius: BORDER_RADIUS.ZERO.PX,
        padding: SPACING.SMALL.PX,
        margin: `${SPACING.LARGE.PX} 0`,
      }}
    >
      <Button
        disabled={
          isFetching ||
          moderationStatus === MODERATION_STATUS.AWAITING_SUBMISSION ||
          moderationStatus === MODERATION_STATUS.APPROVED
        }
        onClick={handleApprove}
      >
        Approve
      </Button>
      <Button
        disabled={
          isFetching ||
          moderationStatus === MODERATION_STATUS.AWAITING_SUBMISSION ||
          moderationStatus === MODERATION_STATUS.REJECTED
        }
        onClick={handleReject}
      >
        Reject
      </Button>
      <Button disabled={isFetching} onClick={handleDelete}>
        Delete
      </Button>
    </Box>
  )
}

export default ModerationPanel
