import { createBrowserClient, createServerClient as createSSRServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client with cookie support
export function createClientComponentClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// For backwards compatibility - shared client instance
export const supabase = createClientComponentClient()

// Server-side Supabase client for API routes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createServerClient(cookies?: any) {
  return createSSRServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: cookies || {
      getAll() {
        return []
      },
      setAll() {
        // No-op for API routes
      },
    },
  })
}