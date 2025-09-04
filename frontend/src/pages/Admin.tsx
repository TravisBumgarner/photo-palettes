import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'
import Button from '@mui/material/Button'
import { useCallback } from 'react'
import { activeModalSignal } from '../signals'
import { MODAL_ID } from '../sharedComponents/Modal/Modal.types'
import { backfillOpenGraphImages } from '../api/admin/backfillOpenGraphImages'
import Box from '@mui/material/Box'
import { SPACING } from '../styles/styleConsts'
import Typography from '@mui/material/Typography'
import useGlobalStore from '../store'

const Admin = () => {
  const addAlert = useGlobalStore((state) => state.addAlert)

  const handleBackfill = useCallback(() => {
    activeModalSignal.value = {
      id: MODAL_ID.CONFIRMATION_MODAL,
      title: 'Backfill Open Graph Tags',
      body: 'Are you sure you want to backfill Open Graph tags for all images?',
      overrideConfirmation: true,
      showCancel: true,
      confirmationCallback: async () => {
        const response = await backfillOpenGraphImages()
        if (response.success) {
          addAlert('Backfill Successful', 'info')
          activeModalSignal.value = null
        } else {
          addAlert('Backfill failed', 'error')
        }
      },
      cancelCallback: () => {
        activeModalSignal.value = null
      },
    }
  }, [addAlert])

  return (
    <PageWrapper width="full" minHeight>
      <PageTitle text="Admin" marginBottom />
      <Box
        sx={{
          margin: `${SPACING.MEDIUM.PX} 0`,
          display: 'flex',
          gap: SPACING.MEDIUM.PX,
          flexDirection: 'column',
          maxWidth: '400px',
        }}
      >
        <Typography variant="h3">Backfill Tags</Typography>
        <Typography>
          V1 OG image tags did not handle aspect ratios well. Photos of humans
          and animals in portrait mode were getting cropped in the middle of the
          face. This script backfills the tags for all images.
        </Typography>
        <Button variant="contained" onClick={handleBackfill}>
          Perform
        </Button>
      </Box>
    </PageWrapper>
  )
}

export default Admin
