import type { AnonPaletteCreationModalProps } from './components/AnonPaletteCreationModal'
import { type ConfirmationModalProps } from './components/ConfirmationModal'

export type ActiveModal = ConfirmationModalProps | AnonPaletteCreationModalProps

export const MODAL_ID = {
  ANON_PALETTE_CREATION_MODAL: 'ANON_PALETTE_CREATION_MODAL',
  CONFIRMATION_MODAL: 'CONFIRMATION_MODAL',
} as const

export type ModalId = (typeof MODAL_ID)[keyof typeof MODAL_ID]
