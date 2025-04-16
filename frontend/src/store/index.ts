import { User } from '@supabase/supabase-js'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { State } from './types'

const useGlobalStore = create<State>()(
  devtools(
    set => ({
      user: undefined,
      isAppAuthenticating: true,
      setUser: (user: User | null) => set({ user }),
      setIsAppAuthenticating: (isAppAuthenticating: boolean) => set({ isAppAuthenticating }),
    }),
    {
      name: 'store',
    }
  )
)

export default useGlobalStore
