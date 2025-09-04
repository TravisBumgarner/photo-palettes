import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import MUIModal from '@mui/material/Modal'
import { useCallback, type FC } from 'react'
import { IoMdClose } from 'react-icons/io'
import { BORDER_RADIUS, SPACING, Z_INDICES } from '../../../styles/styleConsts'
import { activeModalSignal } from '../../../signals'
interface ActiveModal {
  children: React.ReactNode | React.ReactNode[]
  hideCloseButton?: boolean
}

const Modal: FC<ActiveModal> = ({ children }) => {
  const handleClose = useCallback((_event: unknown, reason?: string) => {
    if (reason === 'backdropClick') return
    activeModalSignal.value = null
  }, [])

  return (
    <MUIModal
      sx={{
        maxHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.paper',
        zIndex: Z_INDICES.MODAL,
      }}
      open={activeModalSignal.value !== null}
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <IconButton component="button" onClick={handleClose}>
            <IoMdClose size={24} />
          </IconButton>
        </Box>
        {children}
      </Box>
    </MUIModal>
  )
}

export default Modal
