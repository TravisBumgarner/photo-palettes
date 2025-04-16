import { User } from '@supabase/supabase-js'

export interface State {
  user: User | null
  setUser: (user: User | null) => void
  isAppAuthenticating: boolean
  setIsAppAuthenticating: (isAppAuthenticating: boolean) => void
}
