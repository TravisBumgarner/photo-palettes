// Note - I could not use the config that I typically use with notNull because
// with NextJS notNull runs before the process.env is available.

const config = {
  apiUrl: import.meta.env.VITE_PUBLIC_API_URL!,
  supabaseUrl: import.meta.env.VITE_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY!,
  is_production: import.meta.env.VITE_PUBLIC_ENVIRONMENT! === "production",
};

export default config;
