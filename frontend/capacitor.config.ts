import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.photopalettes',
  appName: 'Photo Palettes',
  webDir: 'dist',
  server: {
    url: 'http://192.168.0.46:3000',
    cleartext: true,
  },
  ios: {
    // This makes the app draw under the status bar but you need safe-area insets
    contentInset: 'always',
  },
}

export default config
