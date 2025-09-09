import type { CapacitorConfig } from '@capacitor/cli'

const isDevelopment = process.env.NODE_ENV === 'development' // eslint-disable-line

const config: CapacitorConfig = {
  appId: 'com.photopalettes',
  appName: 'Photo Palettes',
  webDir: 'dist',
  ...(isDevelopment
    ? {
        server: {
          url: 'http://localhost:3000',
          // I'm not sure when the next line is needed. The simulator can access localhost fine.
          // url: 'http://192.168.0.49:3000', // This might be needed for Simulator development. For now I can build and access the app on my
          cleartext: true,
        },
      }
    : {}),
  ios: {
    // This makes the app draw under the status bar but you need safe-area insets
    contentInset: 'never',
    scheme: 'Photo Palettes',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false, // don’t auto-hide immediately
      backgroundColor: '#FFFFFF',
    },
  },
}

export default config
