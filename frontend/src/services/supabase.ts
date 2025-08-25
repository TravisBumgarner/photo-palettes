import { createClient } from '@supabase/supabase-js'
import { logger } from './logging'
import config from '../config'

//TODO - FIx
type Response =
  | { success: true; data?: unknown }
  | { error: string; success: false }

const client = createClient(config.supabaseUrl, config.supabaseAnonKey)

export async function getUser() {
  const sessionExists = await client.auth.getSession()

  if (!sessionExists.data.session) {
    return { user: null, success: true }
  }

  const { data, error } = await client.auth.getUser()
  if (error) {
    logger.error(`Get user failed ${JSON.stringify(error)}`)
    return { error: 'Get user failed', success: false }
  }

  return { user: data.user, success: true }
}

export async function login({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<Response> {
  const { error, data } = await client.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    logger.error(`Login failed ${JSON.stringify(error)}`)
    return { error: 'Login Failed', success: false }
  }

  return { success: true, data }
}

export async function signup({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<Response> {
  const { error } = await client.auth.signUp({ email, password })
  if (error) {
    logger.error(`Signup failed ${JSON.stringify(error)}`)
    return { error: 'Signup failed', success: false }
  }
  return { success: true }
}

export async function logout(): Promise<Response> {
  await client.auth.signOut()
  return { success: true }
}

export async function getToken() {
  const { data, error } = await client.auth.getSession()
  if (error) {
    logger.error(`Get token failed ${JSON.stringify(error)}`)
    return { error: 'Get token failed', success: false }
  }
  return { token: data.session?.access_token, success: true }
}
