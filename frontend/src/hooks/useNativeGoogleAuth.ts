// import { useEffect } from 'react'
// import { App as CapApp } from '@capacitor/app'
// import { Browser } from '@capacitor/browser'
// import { client } from '../services/supabase'
// import { loadUserIntoState } from '../utils/loadUserIntoState'
// import { logger } from '../services/logging'
// import { NATIVE_AUTH_CALLBACK_URL } from '../consts'
// import type { PluginListenerHandle } from '@capacitor/core'

// export function useNativeGoogleAuth() {
//   useEffect(() => {
//     let sub: PluginListenerHandle | undefined

//     const setupListener = async () => {
//       sub = await CapApp.addListener('appUrlOpen', async ({ url }) => {
//         console.log('Deep link opened:', url)

//         if (!url.startsWith(NATIVE_AUTH_CALLBACK_URL)) return

//         try {
//           await Browser.close().catch(() => {})

//           // ✅ Exchange the code for a session (PKCE flow)
//            this line seems to be broken with auth now once deployed to a real phone.
//           const { data, error } = await client.auth.exchangeCodeForSession(url)

//           if (error) {
//             logger.error('Google Native Auth: exchange failed', error)
//           } else if (data?.session) {
//             logger.info('Google Native Auth: signed in successfully')
//             loadUserIntoState()
//           } else {
//             logger.error('Google Native Auth: no session returned')
//           }
//         } catch (err) {
//           logger.error('Google Native Auth: unexpected error', err)
//         }
//       })
//     }

//     setupListener()

//     return () => {
//       sub?.remove()
//     }
//   }, [])
// }
