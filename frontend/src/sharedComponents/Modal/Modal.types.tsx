import type { AnonPaletteCreationModalProps } from './components/AnonPaletteCreationModal'
import { type ConfirmationModalProps } from './components/ConfirmationModal'
import type { ModeratorSharePostToSocialsProps } from './components/ModeratorSharePostToSocials'

export type ActiveModal =
  | ConfirmationModalProps
  | AnonPaletteCreationModalProps
  | ModeratorSharePostToSocialsProps

export const MODAL_ID = {
  ANON_PALETTE_CREATION_MODAL: 'ANON_PALETTE_CREATION_MODAL',
  CONFIRMATION_MODAL: 'CONFIRMATION_MODAL',
  MODERATOR_SHARE_POST_TO_SOCIALS: 'MODERATOR_SHARE_POST_TO_SOCIALS',
} as const

export type ModalId = (typeof MODAL_ID)[keyof typeof MODAL_ID]
