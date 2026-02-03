import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import ChunkErrorBoundary from './components/ChunkErrorBoundary'
import Footer from './components/Footer'
import Router from './components/Router'

import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import Box from '@mui/material/Box'
import Header from './components/Header'
import ScrollToTop from './components/ScrollToTop'
import useCheckTemporaryPalettesAndRedirect from './hooks/useCheckTemporaryPalettesAndRedirect'
import useHealthCheck from './hooks/useHealthCheck'
import useLoadUserIntoState from './hooks/useLoadUserIntoState'
import useParseAnalyticsFromUrl from './hooks/useParseAnalyticsFromUrl'
import useWhatsNew from './hooks/useWhatsNew'
import { logger } from './services/logging'
import Loading from './sharedComponents/Loading'
import Message from './sharedComponents/Message'
import RenderModal from './sharedComponents/Modal'
import useGlobalStore from './store'
import PlatformSpecificStyling from './styles/PlatformSpecificStyling'
import { Z_INDICES } from './styles/styleConsts'
import AppThemeProvider from './styles/Theme'

const queryClient = new QueryClient()

function App() {
  useLoadUserIntoState()
  useCheckTemporaryPalettesAndRedirect()
  // useNativeGoogleAuth()
  useParseAnalyticsFromUrl()
  useWhatsNew()
  const loadingUser = useGlobalStore((state) => state.loadingUser)
  const { isLoading, isHealthy } = useHealthCheck()

  if (!isHealthy) {
    logger.error('Backend is unhealthy')
    SplashScreen.hide()
    return (
      <Message
        color="error"
        message="The backend is currently unavailable."
        callback={() => window.location.reload()}
        callbackText="Retry"
      />
    )
  }

  if (loadingUser || isLoading) {
    if (Capacitor.isNativePlatform()) {
      SplashScreen.show()
      return
    }

    return (
      <Box
        sx={{
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          position: 'fixed',
          zIndex: Z_INDICES.APP_LOADING,
          backgroundColor: 'background.paper',
        }}
      >
        <Loading />
      </Box>
    )
  }

  SplashScreen.hide()

  return (
    <QueryClientProvider client={queryClient}>
      <Box
        // Hide anything in the notch on iOS
        sx={{
          height: 'env(safe-area-inset-top);',
          backgroundColor: 'background.default',
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100%',
          zIndex: 999,
        }}
      />
      <Header />
      <ChunkErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Router />
        </Suspense>
      </ChunkErrorBoundary>
      <Footer />
      <RenderModal />
    </QueryClientProvider>
  )
}

const WrappedApp = () => {
  return (
    <BrowserRouter>
      <AppThemeProvider>
        <PlatformSpecificStyling>
          <App />
          <ScrollToTop />
        </PlatformSpecificStyling>
      </AppThemeProvider>
    </BrowserRouter>
  )
}

export default WrappedApp
