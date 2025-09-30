// Sentry does not run in Figma. Would need to proxy through backend.
export const logger = {
  info: (message: string) => {
    // eslint-disable-next-line no-console
    console.log(message);
  },
  error: (...args: (string | Error | unknown)[]) => {
    // eslint-disable-next-line no-console
    console.error(args.map((arg) => JSON.stringify(arg)).join(" "));
  },
};
