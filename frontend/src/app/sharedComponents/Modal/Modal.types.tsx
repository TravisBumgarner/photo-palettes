import { ModalID } from './Modal.consts'

import { ConfirmationModalProps } from './components/ConfirmationModal'

export type ActiveModal = {
  id: ModalID.ConfirmationModal
  cancelCallback?: () => void
  confirmCallback?: () => void
} & ConfirmationModalProps
