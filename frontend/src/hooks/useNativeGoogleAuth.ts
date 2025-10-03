import { useEffect } from 'react'
import { App as CapApp } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { client } from '../services/supabase'
import type { PluginListenerHandle } from '@capacitor/core'
import { loadUserIntoState } from '../utils/loadUserIntoState'
import { logger } from '../services/logging'
import { NATIVE_AUTH_CALLBACK_URL } from '../consts'

export function useNativeGoogleAuth() {
  useEffect(() => {
    let sub: PluginListenerHandle | undefined
    ;(async () => {
      sub = await CapApp.addListener('appUrlOpen', async ({ url }) => {
        if (url.startsWith(NATIVE_AUTH_CALLBACK_URL)) {
          await Browser.close().catch(() => {})

          const hash = url.split('#')[1]
          const params = new URLSearchParams(hash)

          const access_token = params.get('access_token')
          const refresh_token = params.get('refresh_token')

          if (access_token && refresh_token) {
            const { error } = await client.auth.setSession({
              access_token,
              refresh_token,
            })

            if (error) {
              logger.error('Google Native sAuth error:', error)
            } else {
              loadUserIntoState()
            }
          } else {
            logger.error('Google Native Auth No tokens in redirect URL')
          }
        }
      })
    })()

    return () => {
      if (sub) {
        sub.remove()
      }
    }
  }, [])
}
