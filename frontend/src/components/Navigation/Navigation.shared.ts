import type { ROUTES } from '../../consts'

export const USER_ROUTES: (keyof typeof ROUTES)[] = [
  'favorites',
  'profile',
  'feedback',
  'featureRequests',
  'logout',
  'moderation',
  'admin',
]

export const MODERATOR_ROUTES: (keyof typeof ROUTES)[] = [
  ...USER_ROUTES,
  'moderation',
]

export const ADMIN_ROUTES: (keyof typeof ROUTES)[] = [
  ...MODERATOR_ROUTES,
  'admin',
]

export const ANON_ROUTES: (keyof typeof ROUTES)[] = [
  'login',
  'signup',
  'featureRequests',
]
