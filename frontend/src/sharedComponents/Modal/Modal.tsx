import { type FC } from 'react'

import ConfirmationModal from './components/ConfirmationModal'
import AnonPaletteCreationModal from './components/AnonPaletteCreationModal'
import { useSignals } from '@preact/signals-react/runtime'
import { MODAL_ID } from './Modal.types'
import { activeModalSignal } from '../../signals'

const RenderModal: FC = () => {
  useSignals()

  if (!activeModalSignal.value?.id) return null

  switch (activeModalSignal.value.id) {
    case MODAL_ID.ANON_PALETTE_CREATION_MODAL:
      return <AnonPaletteCreationModal {...activeModalSignal.value} />
    case MODAL_ID.CONFIRMATION_MODAL:
      return <ConfirmationModal {...activeModalSignal.value} />
  }
}

export default RenderModal
