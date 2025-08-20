'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from './server'
import { logger } from '../logging'

type Response = { success: true } | { error: string; success: false }

export async function login(formData: FormData): Promise<Response> {
  const supabase = await createClient()
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    logger.error(`Login failed ${JSON.stringify(error)}`)
    return { error: 'Login Failed', success: false }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signup(formData: FormData): Promise<Response> {
  const supabase = await createClient()
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signUp(data)
  if (error) {
    logger.error(`Signup failed ${JSON.stringify(error)}`)
    return { error: 'Signup failed', success: false }
  }
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function logout(): Promise<Response> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  return { success: true }
}
