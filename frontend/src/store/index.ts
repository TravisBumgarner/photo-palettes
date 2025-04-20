import { User } from '@supabase/supabase-js'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { State } from './types'

const useGlobalStore = create<State>()(
  devtools(
    (set, get) => ({
      user: undefined,
      isAppAuthenticating: true,
      setUser: (user: User | null) => set({ user }),
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
    }),
    {
      name: 'store',
    }
  )
)

export default useGlobalStore
