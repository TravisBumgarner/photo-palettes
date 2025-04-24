import { User as AuthDetails } from '@supabase/supabase-js'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ActiveModal } from '../app/sharedComponents/Modal/Modal.types'
import { State } from './types'

const useGlobalStore = create<State>()(
  devtools(
    (set, get) => ({
      authDetails: undefined,
      isAppAuthenticating: true,
      setAuthDetails: (authDetails: AuthDetails | null) => set({ authDetails }),
      setIsAppAuthenticating: (isAppAuthenticating: boolean) => set({ isAppAuthenticating }),
      alerts: [],
      getAndRemoveNextAlert: () => {
        const alerts = get().alerts
        if (alerts.length === 0) return null

        const nextAlert = alerts[0]
        set({ alerts: alerts.slice(1) })
        return nextAlert
      },
      addAlert: alert => set(state => ({ alerts: [...state.alerts, alert] })),
      activeModal: null,
      setActiveModal: (activeModal: ActiveModal | null) => set({ activeModal }),
    }),
    {
      name: 'store',
    }
  )
)

export default useGlobalStore
