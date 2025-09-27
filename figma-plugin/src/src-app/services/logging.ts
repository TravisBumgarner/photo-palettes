import { captureException, captureMessage } from "@sentry/react";

export const logger = {
  info: (message: string) => {
    if (false) {
      // Todo fix
      captureMessage(message);
    } else {
      // eslint-disable-next-line no-console
      console.log(message);
    }
  },
  error: (...args: (string | Error | unknown)[]) => {
    if (false) {
      // Todo fix
      captureException(JSON.stringify(args));
    } else {
      // eslint-disable-next-line no-console
      console.error(args.map((arg) => JSON.stringify(arg)).join(" "));
    }
  },
};
