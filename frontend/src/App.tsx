import { BrowserRouter } from 'react-router-dom'
import Footer from './components/Footer'
import Router from './components/Router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import useLoadUserIntoState from './hooks/useLoadUserIntoState'
import useGlobalStore from './store'
import Box from '@mui/material/Box'
import Loading from './sharedComponents/Loading'
import AppThemeProvider from './styles/Theme'
import RenderModal from './sharedComponents/Modal'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import NativeNavigation from './components/Navigation/Navigation.Native'
import WebNavigation from './components/Navigation/Navigation.Web'
import PlatformSpecificStyling from './styles/PlatformSpecificStyling'
import useCheckTemporaryPalettesAndRedirect from './hooks/useCheckTemporaryPalettesAndRedirect'
import { Z_INDICES } from './styles/styleConsts'

const queryClient = new QueryClient()

function App() {
  useLoadUserIntoState()
  useCheckTemporaryPalettesAndRedirect()
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
