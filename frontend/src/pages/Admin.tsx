import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useCallback } from 'react'
import { backfillColorNames } from '../api/admin/backfillColorNames'
import { backfillOpenGraphImages } from '../api/admin/backfillOpenGraphImages'
import { MODAL_ID } from '../sharedComponents/Modal/Modal.types'
import { activeModalSignal } from '../signals'
import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'
import { SPACING } from '../styles/styleConsts'

const Admin = () => {
  const handleBackfillOGImages = useCallback(() => {
    activeModalSignal.value = {
      id: MODAL_ID.CONFIRMATION_MODAL,
      title: 'Backfill Open Graph Tags',
      body: 'Are you sure you want to backfill Open Graph tags for all images?',
      overrideConfirmation: true,
      showCancel: true,
      confirmationCallback: async () => {
        const response = await backfillOpenGraphImages()
        if (response.success) {
          alert('Backfill Successful') // eslint-disable-line
          activeModalSignal.value = null
        } else {
          alert('Backfill failed') // eslint-disable-line
        }
      },
      cancelCallback: () => {
        activeModalSignal.value = null
      },
    }
  }, [])

  const handleBackfillColorNames = useCallback(() => {
    activeModalSignal.value = {
      id: MODAL_ID.CONFIRMATION_MODAL,
      title: 'Backfill Color Names',
      body: 'Are you sure you want to backfill color names for all images?',
      overrideConfirmation: true,
      showCancel: true,
      confirmationCallback: async () => {
        const response = await backfillColorNames()
        if (response.success) {
          alert('Backfill Successful') // eslint-disable-line
          activeModalSignal.value = null
        } else {
          alert('Backfill failed') // eslint-disable-line
        }
      },
      cancelCallback: () => {
        activeModalSignal.value = null
      },
    }
  }, [])

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
        <Button variant="contained" onClick={handleBackfillOGImages}>
          Perform
        </Button>
      </Box>

      <Box
        sx={{
          margin: `${SPACING.MEDIUM.PX} 0`,
          display: 'flex',
          gap: SPACING.MEDIUM.PX,
          flexDirection: 'column',
          maxWidth: '400px',
        }}
      >
        <Typography variant="h3">Backfill Color Names</Typography>
        <Typography>Generate color names for all images.</Typography>
        <Button variant="contained" onClick={handleBackfillColorNames}>
          Perform
        </Button>
      </Box>
    </PageWrapper>
  )
}

export default Admin
