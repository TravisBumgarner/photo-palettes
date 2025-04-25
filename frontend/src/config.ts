// Note - I could not use the config that I typically use with notNull because
// with NextJS notNull runs before the process.env is available.

const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  is_production: process.env.NEXT_PUBLIC_ENVIRONMENT! === 'production',
}

export default config
