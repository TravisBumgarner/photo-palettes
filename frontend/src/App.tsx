import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import Footer from './components/Footer'
import Router from './components/Router'

import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import Box from '@mui/material/Box'
import NativeNavigation from './components/Navigation/Navigation.Native'
import WebNavigation from './components/Navigation/Navigation.Web'
import useCheckTemporaryPalettesAndRedirect from './hooks/useCheckTemporaryPalettesAndRedirect'
import useLoadUserIntoState from './hooks/useLoadUserIntoState'
import useParseAnalyticsFromUrl from './hooks/useParseAnalyticsFromUrl'
import Loading from './sharedComponents/Loading'
import RenderModal from './sharedComponents/Modal'
import useGlobalStore from './store'
import PlatformSpecificStyling from './styles/PlatformSpecificStyling'
import { Z_INDICES } from './styles/styleConsts'
import AppThemeProvider from './styles/Theme'

const queryClient = new QueryClient()

function App() {
  useLoadUserIntoState()
  useCheckTemporaryPalettesAndRedirect()
  useParseAnalyticsFromUrl()
  const loadingUser = useGlobalStore((state) => state.loadingUser)

  if (loadingUser) {
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
      {Capacitor.isNativePlatform() ? <NativeNavigation /> : <WebNavigation />}
      <Router />
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
        </PlatformSpecificStyling>
      </AppThemeProvider>
    </BrowserRouter>
  )
}

export default WrappedApp
