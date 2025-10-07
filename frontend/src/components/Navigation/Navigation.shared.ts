import { Capacitor } from '@capacitor/core'
import type { ROUTES } from '../../consts'

type Items = (keyof typeof ROUTES | 'divider')[]

export const USER_ROUTES: Items = [
  'browse',
  'favorites',
  'profile',
  'settings',
  'divider',
  'feedback',
  'featureRequests',
  ...(Capacitor.isNativePlatform()
    ? []
    : (['divider', 'apple', 'android', 'figma'] as const)),

  'divider',
  'logout',
]

export const MODERATOR_ROUTES: Items = [...USER_ROUTES, 'divider', 'moderation']

export const ADMIN_ROUTES: Items = [...MODERATOR_ROUTES, 'divider', 'admin']

export const ANON_ROUTES: Items = [
  'browse',
  'login',
  'signup',
  'divider',
  'feedback',
  'featureRequests',
  ...(Capacitor.isNativePlatform()
    ? []
    : (['divider', 'apple', 'android', 'figma'] as const)),
]
