import { z } from 'zod'

const envSchema = z.object({
  VITE_PUBLIC_API_URL: z.string().url(),
  VITE_PUBLIC_SUPABASE_URL: z.string().url(),
  VITE_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  VITE_PUBLIC_ENVIRONMENT: z.enum(['development', 'production']),
  VITE_PUBLIC_FE_URL: z.string().url(),
})

const envVars = {
  VITE_PUBLIC_API_URL: import.meta.env.VITE_PUBLIC_API_URL,
  VITE_PUBLIC_SUPABASE_URL: import.meta.env.VITE_PUBLIC_SUPABASE_URL,
  VITE_PUBLIC_SUPABASE_ANON_KEY: import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY,
  VITE_PUBLIC_ENVIRONMENT: import.meta.env.VITE_PUBLIC_ENVIRONMENT,
  VITE_PUBLIC_FE_URL: import.meta.env.VITE_PUBLIC_FE_URL,
}

const parsed = envSchema.safeParse(envVars)
if (!parsed.success) {
  // Throw a clear error with details
  throw new Error(
    'Invalid environment variables: ' +
      JSON.stringify(parsed.error.format(), null, 2)
  )
}

const config = {
  apiUrl: parsed.data.VITE_PUBLIC_API_URL,
  supabaseUrl: parsed.data.VITE_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: parsed.data.VITE_PUBLIC_SUPABASE_ANON_KEY,
  isProduction: parsed.data.VITE_PUBLIC_ENVIRONMENT === 'production',
  frontendUrl: parsed.data.VITE_PUBLIC_FE_URL,
}

export default config
