import { BrowserRouter } from 'react-router-dom'
import Footer from './components/Footer'
import Navigation from './components/Navigation'
import Router from './components/Router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import useLoadUserIntoState from './hooks/useLoadUserIntoState'
import useGlobalStore from './store'
import { Box, type SxProps } from '@mui/material'
import Loading from './sharedComponents/Loading'
import AppThemeProvider from './styles/Theme'
import AlertsManager from './components/AlertsManager'
import RenderModal from './sharedComponents/Modal'
import { Capacitor } from '@capacitor/core'
import { useMemo } from 'react'
import { SplashScreen } from '@capacitor/splash-screen'

const queryClient = new QueryClient()

function App() {
  useLoadUserIntoState()
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
          zIndex: 1000,
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
      <BrowserRouter>
        <AlertsManager />
        <Navigation />
        <Router />
        <Footer />
        <RenderModal />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const PlatformSpecificStyling = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const styles = useMemo((): SxProps => {
    if (Capacitor.getPlatform() === 'ios') {
      return {
        padding:
          'env(safe-area-inset-top) 10px env(safe-area-inset-bottom) 10px',
        minHeight: '100vh',
      }
    }

    if (Capacitor.getPlatform() === 'android') {
      return {
        // It appears android needs to be handled differently than iOS but I don't care for Android for now.
        padding: '10px',
      }
    }

    return {
      padding: '10px',
    }
  }, [])

  return <Box sx={styles}>{children}</Box>
}

const WrappedApp = () => {
  return (
    <AppThemeProvider>
      <PlatformSpecificStyling>
        <App />
      </PlatformSpecificStyling>
    </AppThemeProvider>
  )
}

export default WrappedApp
