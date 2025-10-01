import { Capacitor } from '@capacitor/core'
import type { ROUTES } from '../../consts'

type Items = (keyof typeof ROUTES | 'divider')[]

export const USER_ROUTES: Items = [
  ...(Capacitor.isNativePlatform() ? (['browse'] as const) : []),
  'favorites',
  'profile',
  'settings',
  'feedback',
  'featureRequests',
  'logout',
]

export const MODERATOR_ROUTES: Items = [...USER_ROUTES, 'divider', 'moderation']

export const ADMIN_ROUTES: Items = [...MODERATOR_ROUTES, 'divider', 'admin']

export const ANON_ROUTES: Items = [
  ...(Capacitor.isNativePlatform() ? (['browse'] as const) : []),
  'login',
  'signup',
  'feedback',
  'featureRequests',
]
