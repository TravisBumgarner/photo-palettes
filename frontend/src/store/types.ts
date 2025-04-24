import { User as AuthDetails } from '@supabase/supabase-js'
import { ActiveModal } from '../app/sharedComponents/Modal/Modal.types'

export interface State {
  authDetails: AuthDetails | null
  setAuthDetails: (authDetails: AuthDetails | null) => void
  isAppAuthenticating: boolean
  setIsAppAuthenticating: (isAppAuthenticating: boolean) => void
  alerts: string[]
  getAndRemoveNextAlert: () => string | null
  addAlert: (alert: string) => void
  activeModal: null | ActiveModal
  setActiveModal: (activeModal: ActiveModal | null) => void
}
