export type UpdateType = 'add' | 'update' | 'fix'
export type Update = {
  title: string
  date: string
  updates: Record<UpdateType, string[]>
}

export const UPDATES: Update[] = [
  {
    title: 'Full Release',
    date: '2025-10-06',
    updates: {
      add: [
        'iOS App available in app store',
        'Figma Plugin available in Figma Community',
        'Android App testing signup',
        'Support for iPad',
        'Create accounts for Instagram, Twitter, and Bluesky',
        'Automate posting to Instagram, Twitter, and Bluesky when palettes are approved',
        'Download single palettes',
        'Copy colors to clipboard',
        'Backend health check to ensure frontend connects to backend',
        'Users can delete their accounts',
      ],
      update: [
        'Clean up single palette view with better filtering.',
        'Separate backend into backend + worker to reduce app memory usage from 850MB to 300MB',
        'Improve pagination experience',
      ],
      fix: [
        'Properly handle supported and unsupported image formats',
        'Open graph image generation',
      ],
    },
  },
  {
    title: 'Open Beta Release',
    date: '2025-09-15',
    updates: {
      add: [
        'Two new color extraction algorithms - "Shades" and "Tints"',
        'iOS App beta via TestFlight',
        'Integration with Instagram to automatically post palettes when they are approved',
      ],
      update: [
        'Logged out color palette generation now runs much more quickly',
        'Overhauled "Browse Single Palette" experience now with lots more color details',
      ],
      fix: [
        'Proper image scaling throughout the app across all browsers and devices',
        'iOS photo palette download not working',
      ],
    },
  },
  {
    title: 'Feedback from Closed Alpha & Bug Fixes',
    date: '2025-08-27',
    updates: {
      add: [
        'iOS Alpha Release',
        'Drag and reorder colors when creating a palette',
        'Add palettes to favorites list and view them',
        'Integration with Bluesky to automatically post palettes when they are approved',
        'Basic logged out functionality so visitors can create palettes without an account',
      ],
      update: [
        'Entire theme is now grayscale to emphasize color palettes and photos',
      ],
      fix: [
        'Open graph image tag to be more friendly with aspect ratios of all sizes',
        'Images scale correctly on Chrome and Safari',
        'Pagination is consistent between Browse, Favorites, and Profile pages',
      ],
    },
  },
  {
    title: 'Mobile Improvements & Open Alpha Release',
    date: '2025-07-07',
    updates: {
      add: [],
      update: [
        'Cleanup UI on mobile creation page',
        'Improve process of selecting colors when creating photo palette',
        'App is now in open alpha',
      ],
      fix: [],
    },
  },
  {
    title: 'Closed Alpha Release',
    date: '2025-05-18',
    updates: {
      add: [
        'Basic sign up and log in flow',
        'Create, browse, and moderate photo palettes',
        'Generate color palettes from KMeans algorithm',
        'Request new features',
        'Give feedback',
        'Privacy Policy & Terms of Service',
        'Light and dark theme support',
      ],
      update: [],
      fix: [],
    },
  },
]