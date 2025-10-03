import { type FC } from 'react'

import { useSignals } from '@preact/signals-react/runtime'
import { activeModalSignal } from '../../signals'
import type { AnonPaletteCreationModalProps } from './components/AnonPaletteCreationModal'
import AnonPaletteCreationModal from './components/AnonPaletteCreationModal'
import type { ConfirmAccountDeletionModalProps } from './components/ConfirmAccountDeletionModal'
import ConfirmAccountDeletionModal from './components/ConfirmAccountDeletionModal'
import type { ConfirmationModalProps } from './components/ConfirmationModal'
import ConfirmationModal from './components/ConfirmationModal'
import Lightbox, { type LightboxProps } from './components/LightboxModal'
import type { ModeratorSharePostToSocialsProps } from './components/ShareToSocialsModal'
import ModeratorSharePostToSocials from './components/ShareToSocialsModal'
import { MODAL_ID } from './Modal.consts'

export type ActiveModal =
  | ConfirmationModalProps
  | AnonPaletteCreationModalProps
  | ModeratorSharePostToSocialsProps
  | LightboxProps
  | ConfirmAccountDeletionModalProps

export type ModalId = (typeof MODAL_ID)[keyof typeof MODAL_ID]

const RenderModal: FC = () => {
  useSignals()

  if (!activeModalSignal.value?.id) return null

  switch (activeModalSignal.value.id) {
    case MODAL_ID.ANON_PALETTE_CREATION_MODAL:
      return <AnonPaletteCreationModal {...activeModalSignal.value} />
    case MODAL_ID.CONFIRMATION_MODAL:
      return <ConfirmationModal {...activeModalSignal.value} />
    case MODAL_ID.SHARE_TO_SOCIALS_MODAL:
      return <ModeratorSharePostToSocials {...activeModalSignal.value} />
    case MODAL_ID.LIGHTBOX_MODAL:
      return <Lightbox {...activeModalSignal.value} />
    case MODAL_ID.CONFIRM_ACCOUNT_DELETION_MODAL:
      return <ConfirmAccountDeletionModal />
    default:
      return null
  }
}

export default RenderModal
