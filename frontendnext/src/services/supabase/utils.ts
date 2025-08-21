import { createClient } from './client'

export const getToken = async () => {
  const supabase = await createClient()
  const session = await supabase.auth.getSession()
  const tokens = session?.data?.session?.access_token
  return tokens
}
