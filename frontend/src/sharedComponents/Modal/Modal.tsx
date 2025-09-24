import { type FC } from 'react'

import { useSignals } from '@preact/signals-react/runtime'
import { activeModalSignal } from '../../signals'
import AnonPaletteCreationModal from './components/AnonPaletteCreationModal'
import ConfirmationModal from './components/ConfirmationModal'
import ModeratorSharePostToSocials from './components/ModeratorSharePostToSocials'
import { MODAL_ID } from './Modal.types'

const RenderModal: FC = () => {
  useSignals()

  if (!activeModalSignal.value?.id) return null

  switch (activeModalSignal.value.id) {
    case MODAL_ID.ANON_PALETTE_CREATION_MODAL:
      return <AnonPaletteCreationModal {...activeModalSignal.value} />
    case MODAL_ID.CONFIRMATION_MODAL:
      return <ConfirmationModal {...activeModalSignal.value} />
    case MODAL_ID.MODERATOR_SHARE_POST_TO_SOCIALS:
      return <ModeratorSharePostToSocials {...activeModalSignal.value} />
  }
}

export default RenderModal
