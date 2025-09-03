export const getUserColorFromUUID = (uuid: string) => {
  return `#${uuid.slice(0, 6).toLocaleUpperCase()}`
}
