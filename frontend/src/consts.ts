/** Auth */

export const MINIMUM_PASSWORD_LENGTH = 8 // This should maybe go to backend? Or maybe shared in JSON?

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
    href: '/browse',
    label: 'Browse',
  },
  moderation: {
    key: 'moderation',
    href: '/moderation',
    label: 'Moderation',
  },
  profile: {
    key: 'profile',
    href: '/profile',
    label: 'Profile',
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
  featureRequests: {
    key: 'featureRequests',
    href: '/feature_requests',
    label: 'Feature Requests',
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
  donate: {
    key: 'donate',
    href: '/donations',
    label: 'Donate',
  },
  changelog: {
    key: 'changelog',
    href: '/changelog',
    label: 'Changelog',
  },
}

// Congrats, you found the secret invitation key!
// The rest of the app is quite secure.
export const SUPER_SECRET_INVITATION_KEY = 'welcome-to-photo-palettes'
