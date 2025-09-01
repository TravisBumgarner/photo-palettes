import { type User } from '@supabase/supabase-js'
import type { EPermissionLevel } from '../types'

export interface AppUserDetails {
  permissionLevel: EPermissionLevel
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
  loadingUser: boolean
  setLoadingUser: (loadingUser: boolean) => void
  appUserDetails: AppUserDetails | null
  setAppUserDetails: (appUserDetails: AppUserDetails | null) => void
  alerts: TAlert[]
  getAndRemoveNextAlert: () => TAlert | null
  addAlert: (text: string, color: 'info' | 'error' | 'success') => void
}
