import { type User } from '@supabase/supabase-js'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { type AppUserDetails, type State } from './types'

const useGlobalStore = create<State>()(
  devtools(
    (set) => ({
      authId: undefined,
      loadingUser: true,
      appUserDetails: undefined,
      setAppUserDetails: (appUserDetails: AppUserDetails | null) =>
        set({ appUserDetails }),
      setAuthId: (authId: User['id'] | null) => set({ authId }),
      setLoadingUser: (loadingUser: boolean) => set({ loadingUser }),
    }),
    {
      name: 'store',
    }
  )
)

export default useGlobalStore
