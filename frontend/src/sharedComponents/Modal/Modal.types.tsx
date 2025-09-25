import type { AnonPaletteCreationModalProps } from './components/AnonPaletteCreationModal'
import { type ConfirmationModalProps } from './components/ConfirmationModal'
import type { ModeratorSharePostToSocialsProps } from './components/ShareToSocialsModal'

export type ActiveModal =
  | ConfirmationModalProps
  | AnonPaletteCreationModalProps
  | ModeratorSharePostToSocialsProps

export const MODAL_ID = {
  ANON_PALETTE_CREATION_MODAL: 'ANON_PALETTE_CREATION_MODAL',
  CONFIRMATION_MODAL: 'CONFIRMATION_MODAL',
  SHARE_TO_SOCIALS: 'SHARE_TO_SOCIALS',
} as const

export type ModalId = (typeof MODAL_ID)[keyof typeof MODAL_ID]
