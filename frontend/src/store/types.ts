import { User } from '@supabase/supabase-js'
import { ActiveModal } from '../app/sharedComponents/Modal/Modal.types'
import { TGeneratedPalette, TSwatch } from '../types'

export interface AppUserDetails {
  permissionLevel: number
  displayName: string
  email: string
  id: string
}

export interface TAlert {
  message: string
  color: 'info' | 'error' | 'success'
  id: number
}

export interface State {
  authId: User['id'] | null
  setAuthId: (authId: User['id'] | null) => void
  isAppAuthenticating: boolean
  setIsAppAuthenticating: (isAppAuthenticating: boolean) => void
  appUserDetails: AppUserDetails | null
  setAppUserDetails: (appUserDetails: AppUserDetails | null) => void
  alerts: TAlert[]
  getAndRemoveNextAlert: () => TAlert | null
  addAlert: (text: string, color: 'info' | 'error' | 'success') => void
  activeModal: null | ActiveModal
  setActiveModal: (activeModal: ActiveModal | null) => void
  newPalette: TGeneratedPalette
  setNewPalette: (newPalette: TGeneratedPalette) => void
  updateNewPalette: (swatchIndex: number, newSwatch: TSwatch) => void
}
