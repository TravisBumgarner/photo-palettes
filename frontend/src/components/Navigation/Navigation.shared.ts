import type { ROUTES } from '../../consts'

export const ADMIN_ROUTES: (keyof typeof ROUTES)[] = [
  'favorites',
  'profile',
  'moderation',
  'admin',
  'feedback',
  'featureRequests',
  'logout',
]

export const MODERATOR_ROUTES: (keyof typeof ROUTES)[] = [
  'favorites',
  'profile',
  'moderation',
  'feedback',
  'featureRequests',
  'logout',
]

export const USER_ROUTES: (keyof typeof ROUTES)[] = [
  'favorites',
  'profile',
  'feedback',
  'featureRequests',
  'logout',
]

export const ANON_ROUTES: (keyof typeof ROUTES)[] = [
  'login',
  'signup',
  'featureRequests',
]
