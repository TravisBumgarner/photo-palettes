import { Capacitor } from '@capacitor/core'
import { init } from '@sentry/react'
import posthog from 'posthog-js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import config from './config.ts'
import './styles/global.css'

if (config.isProduction) {
  const platform = Capacitor.getPlatform()
  const isNative = platform !== 'web'

  posthog.init(config.posthogKey, {
    api_host: config.posthogHost,
    defaults: '2026-01-30',
    person_profiles: 'identified_only',
    capture_exceptions: true,
    ...(isNative && { persistence: 'localStorage' }),
  })

  posthog.register({ platform })
}

init({
  dsn: 'https://3f84cd19644b1a6cb6ec5cc55c9c1486@o196886.ingest.us.sentry.io/4509883299397632',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  enabled: config.isProduction,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
