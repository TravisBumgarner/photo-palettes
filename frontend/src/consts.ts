import { FaBluesky } from 'react-icons/fa6'
import { FaInstagram } from 'react-icons/fa'
import { FaDiscord } from 'react-icons/fa6'
import { FaTwitter } from 'react-icons/fa'
import type { IconType } from 'react-icons/lib'

export const iconMap: Partial<Record<keyof typeof ROUTES, IconType>> = {
  bluesky: FaBluesky,
  instagram: FaInstagram,
  discord: FaDiscord,
  twitter: FaTwitter,
}

// This value is controlled by Supabase, so if you change it here, be sure to also.
export const MINIMUM_PASSWORD_LENGTH = 10

export const ROUTES = {
  privacy: {
    key: 'privacy',
    href: '/privacy',
    label: 'Privacy Policy',
  },
  tos: {
    key: 'tos',
    href: '/tos',
    label: 'Terms of Service',
  },
  home: {
    key: 'home',
    href: '/',
    label: 'Photo Palettes',
  },
  browse: {
    key: 'browse',
    href: '/',
    label: 'Browse',
  },
  moderation: {
    key: 'moderation',
    href: '/moderation',
    label: 'Moderation',
  },
  admin: {
    key: 'admin',
    href: '/admin',
    label: 'Admin',
  },
  profile: {
    key: 'profile',
    href: '/profile',
    label: 'Profile',
  },
  favorites: {
    key: 'favorites',
    href: '/favorites',
    label: 'Favorites',
  },
  create: {
    key: 'create',
    href: '/create',
    label: 'Create',
  },
  feedback: {
    key: 'feedback',
    href: '/feedback',
    label: 'Feedback',
  },
  login: {
    key: 'login',
    href: '/login',
    label: 'Login',
  },
  signup: {
    key: 'signup',
    href: '/signup',
    label: 'Signup',
  },
  logout: {
    key: 'logout',
    href: '/logout',
    label: 'Logout',
  },
  passwordReset: {
    key: 'passwordReset',
    href: '/password_reset',
    label: 'Reset Password',
  },
  featureRequests: {
    key: 'featureRequests',
    href: '/feature_requests',
    label: 'Feature Requests',
  },
  settings: {
    key: 'settings',
    href: '/settings',
    label: 'Settings',
  },
  discord: {
    key: 'discord',
    href: 'https://discord.com/invite/J8jwMxEEff',
    label: 'Discord',
  },
  bluesky: {
    key: 'bluesky',
    href: 'https://bsky.app/profile/photopalettes.com',
    label: 'Bluesky',
  },
  instagram: {
    key: 'instagram',
    href: 'https://www.instagram.com/photocolorpalettes',
    label: 'Instagram',
  },
  twitter: {
    key: 'twitter',
    href: 'https://x.com/photo_palettes',
    label: 'Twitter',
  },
  donate: {
    key: 'donate',
    href: '/donations',
    label: 'Donate',
  },
  releaseNotes: {
    key: 'releasenotes',
    href: '/releasenotes',
    label: 'Release Notes',
  },
  error404: {
    key: 'error404',
    href: '/error404',
    label: '404 Not Found',
  },
  error500: {
    key: 'error500',
    href: '/error500',
    label: '500 Internal Server Error',
  },
}

export const PAGINATION_SIZE = 10

export const PALETTE_SIZE = 6

export const NATIVE_AUTH_CALLBACK_URL = 'com.photopalettes://auth/callback'
