import * as amplitude from '@amplitude/analytics-browser'
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser'
import { init } from '@sentry/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import config from './config.ts'
import './styles/global.css'

if (config.isProduction) {
  amplitude.add(sessionReplayPlugin())
  amplitude.init('d398356d5961d66d5f5aa55ccf5ea679', {
    autocapture: {
      attribution: true,
      fileDownloads: true,
      formInteractions: true,
      pageViews: true,
      sessions: true,
      elementInteractions: true,
      networkTracking: true,
      webVitals: true,
      frustrationInteractions: true,
    },
  })
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
