import { User } from '@supabase/supabase-js'
import { ActiveModal } from '../app/_sharedComponents/Modal/Modal.types'

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
  triggerFetchUser: boolean
  setTriggerFetchUser: (triggerFetchUser: boolean) => void
  appUserDetails: AppUserDetails | null
  setAppUserDetails: (appUserDetails: AppUserDetails | null) => void
  alerts: TAlert[]
  getAndRemoveNextAlert: () => TAlert | null
  addAlert: (text: string, color: 'info' | 'error' | 'success') => void
  activeModal: null | ActiveModal
  setActiveModal: (activeModal: ActiveModal | null) => void
}
