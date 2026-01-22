# About Marketing Page Design

## Overview

Add an "About" marketing page to Photo Palettes that provides information about the app and its available platforms. The page should be accessible from the top navigation, but only visible to:
1. Logged out users (anonymous)
2. Users on the web platform (not mobile app)

## Requirements

### Navigation Visibility

The "About" link should appear in the top navigation menu with the following conditions:
- **Show when:** User is anonymous (not logged in) AND on web platform
- **Hide when:** User is logged in OR on native mobile app (iOS/Android)

This requires modifying the navigation system to support web-only routes for anonymous users.

### About Page Content

The page should include:

1. **Hero Section**
   - App name and tagline
   - Brief description of what Photo Palettes does (generate color palettes from photos)

2. **Platform Availability Section**
   - iOS App: Available on App Store (with link)
   - Figma Plugin: Available on Figma Community (with link)
   - Android: Coming soon (no link, just indicator)

3. **Screenshot Placeholders**
   - Placeholder sections for app screenshots
   - Use consistent styling with existing pages
   - 3-4 placeholder areas for future screenshots

4. **Call to Action**
   - Sign up button for new users
   - Link to browse palettes

### Technical Implementation

- Route: `/about`
- Component: `/frontend/src/pages/About.tsx`
- Add route constant to `/frontend/src/consts.ts`
- Add route to `/frontend/src/components/Router.tsx`
- Modify navigation shared config to include About for anonymous web users
- Use existing MUI components and styling patterns
- Follow existing page layout patterns (see PrivacyPolicy.tsx, Donations.tsx for reference)

### Platform Detection

Use existing Capacitor detection:
```typescript
import { Capacitor } from '@capacitor/core'
Capacitor.isNativePlatform() // true on iOS/Android, false on web
```

### Styling

- Use existing MUI theme and components
- Match styling of other public pages (PrivacyPolicy, Donations, etc.)
- Responsive design for all screen sizes
- Screenshot placeholders should use MUI Paper or Card components with placeholder content

## Out of Scope

- Actual screenshots (will use placeholders)
- SEO metadata optimization
- Analytics tracking (can use existing Amplitude patterns if desired)
