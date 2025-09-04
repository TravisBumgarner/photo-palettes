import type { ROUTES } from '../../consts'

type Items = (keyof typeof ROUTES | 'divider')[]

export const USER_ROUTES: Items = [
  'favorites',
  'profile',
  'feedback',
  'featureRequests',
  'logout',
]

export const MODERATOR_ROUTES: Items = [...USER_ROUTES, 'divider', 'moderation']

export const ADMIN_ROUTES: Items = [...MODERATOR_ROUTES, 'divider', 'admin']

export const ANON_ROUTES: Items = [
  'login',
  'signup',
  'feedback',
  'featureRequests',
]
