import { Box, IconButton } from '@mui/material'
import MUIModal from '@mui/material/Modal'
import { useCallback, type FC } from 'react'
import { IoMdClose } from 'react-icons/io'
import useGlobalStore from '../../../store'
import { BORDER_RADIUS, SPACING } from '../../../styles/styleConsts'
interface ActiveModal {
  children: React.ReactNode | React.ReactNode[]
  hideCloseButton?: boolean
}

const Modal: FC<ActiveModal> = ({ children, hideCloseButton = false }) => {
  const { activeModal, setActiveModal } = useGlobalStore()

  const handleClose = useCallback(
    (_event: unknown, reason?: string) => {
      if (reason === 'backdropClick') return
      setActiveModal(null)
    },
    [setActiveModal]
  )

  return (
    <MUIModal
      sx={{
        maxHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.paper',
      }}
      open={activeModal !== null}
      onClose={handleClose}
      disableRestoreFocus={true}
      disableEscapeKeyDown={true}
    >
      <Box
        sx={{
          width: '500px',
          maxWidth: '90%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.paper',
          color: 'text.primary',
          padding: SPACING.MEDIUM.PX,
          borderRadius: BORDER_RADIUS.ZERO.PX,
        }}
      >
        {!hideCloseButton && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              paddingBottom: '20px',
            }}
          >
            <IconButton component="button" onClick={handleClose}>
              <IoMdClose size={24} />
            </IconButton>
          </Box>
        )}
        {children}
      </Box>
    </MUIModal>
  )
}

export default Modal
