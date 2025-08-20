/** @type {import('next').NextConfig} */

// Making this import/export will cause lint to fail.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { withSentryConfig } = require('@sentry/nextjs')

const config = {
  allowedDevOrigins: ['*'],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_SHOW_NAVIGATION: process.env.NEXT_SHOW_NAVIGATION,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_FE_URL: process.env.NEXT_PUBLIC_FE_URL,
  },
  images: {
    remotePatterns: [
      new URL('https://res.cloudinary.com/hqjbxtyku/image/upload/**'),
      {
        protocol: 'http',
        hostname: 'backend',
        port: '8000',
        pathname: '/uploads/**',
      },
    ],
  },
  turbopack: {
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.md'],
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

// Making this import/export will cause lint to fail.
module.exports = withSentryConfig(config, sentryWebpackPluginOptions)
