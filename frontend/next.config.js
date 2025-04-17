/** @type {import('next').NextConfig} */
import { withSentryConfig } from '@sentry/nextjs'

const config = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_SHOW_NAVIGATION: process.env.NEXT_SHOW_NAVIGATION,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

const sentryWebpackPluginOptions = {
  org: 'travis-bumgarner',
  project: 'photo-palettes-frontend',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  disableLogger: true,
  automaticVercelMonitors: true,
}

export default withSentryConfig(config, sentryWebpackPluginOptions)
