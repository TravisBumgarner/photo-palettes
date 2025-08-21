import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.photopalettes',
  appName: 'Photo Palettes',
  webDir: 'dist',
  server: {
    url: 'http://192.168.0.46:3000',
    cleartext: true,
  },
}

export default config
