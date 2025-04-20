import { User } from '@supabase/supabase-js'
import { ActiveModal } from '../app/sharedComponents/Modal/Modal.types'

export interface State {
  user: User | null
  setUser: (user: User | null) => void
  isAppAuthenticating: boolean
  setIsAppAuthenticating: (isAppAuthenticating: boolean) => void
  alerts: string[]
  getAndRemoveNextAlert: () => string | null
  addAlert: (alert: string) => void
  activeModal: null | ActiveModal
  setActiveModal: (activeModal: ActiveModal | null) => void
}
