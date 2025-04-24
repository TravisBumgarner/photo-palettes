import { Box } from '@mui/material'
import MUIModal from '@mui/material/Modal'
import { useCallback, type FC } from 'react'
import useGlobalStore from '../../../../store'

interface ActiveModal {
  children: React.ReactNode | React.ReactNode[]
  hideCloseButton?: boolean
}

const Modal: FC<ActiveModal> = ({ children, hideCloseButton = false }) => {
  const { activeModal, setActiveModal } = useGlobalStore()

  const handleClose = useCallback(() => {
    setActiveModal(null)
  }, [setActiveModal])

  return (
    <MUIModal
      sx={{
        maxHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--foreground)',
      }}
      open={activeModal !== null}
      onClose={handleClose}
      disableRestoreFocus={true}
    >
      <Box
        sx={{
          width: '500px',
          maxWidth: '90%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
        }}
      >
        {!hideCloseButton && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '20px' }}>
            <button onClick={handleClose}>&times;</button>
          </Box>
        )}
        {children}
      </Box>
    </MUIModal>
  )
}

export default Modal
