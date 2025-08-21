const config = {
  apiUrl: import.meta.env.VITE_PUBLIC_API_URL,
  supabaseUrl: import.meta.env.VITE_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY,
  isProduction: import.meta.env.VITE_PUBLIC_ENVIRONMENT === 'production',
  frontendUrl: import.meta.env.VITE_PUBLIC_FE_URL,
}

export default config
