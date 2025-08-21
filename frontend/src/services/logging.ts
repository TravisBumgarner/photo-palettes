import * as Sentry from '@sentry/react'
import config from '../config'

export const logger = {
  info: (message: string) => {
    console.log(message)
  },
  error: (...args: (string | Error | unknown)[]) => {
    if (config.isProduction) {
      Sentry.captureException(JSON.stringify(args))
    } else {
      console.error(args.map((arg) => JSON.stringify(arg)).join(' '))
    }
  },
}
