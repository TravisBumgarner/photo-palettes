import { User } from '@supabase/supabase-js'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ActiveModal } from '../app/sharedComponents/Modal/Modal.types'
import { TGeneratedPalette, TSwatch } from '../types'
import { AppUserDetails, State } from './types'

const useGlobalStore = create<State>()(
  devtools(
    (set, get) => ({
      authId: undefined,
      isAppAuthenticating: true,
      appUserDetails: undefined,
      setAppUserDetails: (appUserDetails: AppUserDetails | null) => set({ appUserDetails }),
      setAuthId: (authId: User['id'] | null) => set({ authId }),
      setIsAppAuthenticating: (isAppAuthenticating: boolean) => set({ isAppAuthenticating }),
      alerts: [],
      getAndRemoveNextAlert: () => {
        const alerts = get().alerts
        if (alerts.length === 0) return null

        const nextAlert = alerts[0]
        set({ alerts: alerts.slice(1) })
        return nextAlert
      },
      addAlert: (text, color) =>
        set(state => ({ alerts: [...state.alerts, { message: text, color, id: Math.random() }] })),
      activeModal: null,
      setActiveModal: (activeModal: ActiveModal | null) => set({ activeModal }),
      newPalette: [
        { color: '#000000', percentLocation: [25, 33] },
        { color: '#000000', percentLocation: [50, 33] },
        { color: '#000000', percentLocation: [75, 33] },
        { color: '#000000', percentLocation: [25, 66] },
        { color: '#000000', percentLocation: [50, 66] },
        { color: '#000000', percentLocation: [75, 66] },
      ],
      setNewPalette: (newPalette: TGeneratedPalette) => set({ newPalette }),
      updateNewPalette: (swatchIndex: number, newSwatch: TSwatch) =>
        set(state => ({
          newPalette: state.newPalette?.map((swatch, index) =>
            index === swatchIndex ? newSwatch : swatch
          ),
        })),
    }),
    {
      name: 'store',
    }
  )
)

export default useGlobalStore
