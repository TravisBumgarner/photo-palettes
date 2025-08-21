import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'

import App from './App.tsx'
import './styles/global.css'
import config from './config.ts'

Sentry.init({
  dsn: 'https://3f84cd19644b1a6cb6ec5cc55c9c1486@o196886.ingest.us.sentry.io/4509883299397632',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  enabled: config.is_production,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
