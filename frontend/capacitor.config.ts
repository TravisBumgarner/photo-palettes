// capacitor.config.js
// @ts-check

// Fuck this file. Every other fucking time I open it redlines about something.
import os from 'os'

const isDevelopment = process.env.NODE_ENV === 'development' //eslint-disable-line

/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: 'com.photopalettes',
  appName: 'Photo Palettes',
  webDir: 'dist-native',
  ...(isDevelopment
    ? {
        server: {
          url: `http://${getLocalIp()}:3000`,
          cleartext: true,
        },
      }
    : {}),
  ios: {
    contentInset: 'never',
    scheme: 'Photo Palettes',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#FFFFFF',
    },
  },
}

function getLocalIp() {
  const nets = os.networkInterfaces()
  for (const name of Object.keys(nets)) {
    const iface = nets[name]
    if (!iface) continue

    for (const net of iface) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return '127.0.0.1'
}
console.log('config', config) // eslint-disable-line
module.exports = config
