import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import QueryProvider from '../providers/QueryProvider'
import AppThemeProvider from '../styles/Theme'
import AlertsManager from './_components/AlertsManager'
import Footer from './_components/Footer'
import { LoadUserIntoStore } from './_components/LoadUserIntoState'
import Navigation from './_components/Navigation'
import './global.css'
import RenderModal from './_sharedComponents/Modal'

const satoshi = localFont({
  src: [
    {
      path: '../../public/fonts/Satoshi-Variable.woff2',
      weight: '300 700',
      style: 'normal',
    },
  ],
  variable: '--font-satoshi',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://photopalettes.com'),
  title: 'Photo Palettes',
  description: 'A social platform for generating color palettes from photos.',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    images: ['/og.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={satoshi.variable}>
      <head>
        <GoogleAnalytics gaId="G-ZC6BZFH3W8" />
      </head>
      <body>
        <div id="root">
          <AppRouterCacheProvider>
            <AppThemeProvider>
              <LoadUserIntoStore />
              <AlertsManager />
              <Navigation />
              <QueryProvider>{children}</QueryProvider>
              <RenderModal />
              <Footer />
            </AppThemeProvider>
          </AppRouterCacheProvider>
        </div>
      </body>
    </html>
  )
}
