import * as Sentry from '@sentry/react'
import config from '../config'

export const logger = {
  info: (message: string) => {
    // eslint-disable-next-line no-console
    console.log(message)
  },
  error: (...args: (string | Error | unknown)[]) => {
    if (config.environment === 'development') {
      // eslint-disable-next-line no-console
      console.error(args.map(arg => JSON.stringify(arg)).join(' '))
    } else {
      Sentry.captureException(JSON.stringify(args))
    }
  },
}
