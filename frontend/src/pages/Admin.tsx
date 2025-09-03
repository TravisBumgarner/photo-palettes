import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'
import Button from '@mui/material/Button'
import { useCallback } from 'react'
import { activeModalSignal } from '../signals'
import { MODAL_ID } from '../sharedComponents/Modal/Modal.types'
import { backfillOpenGraphImages } from '../api/admin/backfillOpenGraphImages'
import Box from '@mui/material/Box'
import { SPACING } from '../styles/styleConsts'

const Admin = () => {
  const handleBackfill = useCallback(() => {
    activeModalSignal.value = {
      id: MODAL_ID.CONFIRMATION_MODAL,
      title: 'Backfill Open Graph Tags',
      body: 'Are you sure you want to backfill Open Graph tags for all images?',
      confirmationCallback: async () => {
        const response = await backfillOpenGraphImages()
        if (response.success) {
          activeModalSignal.value = null
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
      <Box sx={{ margin: `${SPACING.MEDIUM.PX} 0` }}>
        <Button variant="contained" onClick={handleBackfill}>
          Backfill OG Tags
        </Button>
      </Box>
    </PageWrapper>
  )
}

export default Admin
