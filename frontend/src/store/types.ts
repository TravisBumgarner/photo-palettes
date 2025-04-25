import { User } from '@supabase/supabase-js'
import { ActiveModal } from '../app/sharedComponents/Modal/Modal.types'

export interface AppUserDetails {
  permissionLevel: number
  displayName: string
  email: string
  id: string
}
export interface State {
  authId: User['id'] | null
  setAuthId: (authId: User['id'] | null) => void
  isAppAuthenticating: boolean
  setIsAppAuthenticating: (isAppAuthenticating: boolean) => void
  appUserDetails: AppUserDetails | null
  setAppUserDetails: (appUserDetails: AppUserDetails | null) => void
  alerts: string[]
  getAndRemoveNextAlert: () => string | null
  addAlert: (alert: string) => void
  activeModal: null | ActiveModal
  setActiveModal: (activeModal: ActiveModal | null) => void
}
