import * as Sentry from '@sentry/react'
import config from '../config'

export const logger = {
  info: (message: string) => {
    console.log(message)
  },
  error: (...args: (string | Error | unknown)[]) => {
    if (config.environment === 'development') {
      console.error(args.map(arg => JSON.stringify(arg)).join(' '))
    } else {
      Sentry.captureException(JSON.stringify(args))
    }
  },
}
