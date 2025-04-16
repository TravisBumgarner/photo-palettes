import config from '../config'

export const callBackend = async () => {
  const res = await fetch(`${config.apiUrl}`)
  return res.json()
}
