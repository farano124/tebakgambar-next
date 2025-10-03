
import { createBrowserClient, createServerClient as createSSRServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client with cookie support
export function createClientComponentClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// For backwards compatibility - shared client instance (used by client components)
// Lazily create only in the browser to keep this module safe to import on the server.
export const supabase = typeof window !== 'undefined'
  ? createClientComponentClient()
  : (null as unknown as ReturnType<typeof createBrowserClient>)

// Server-side Supabase client for API routes and server environments.
// NOTE: Do NOT import server-only modules (e.g., next/headers) here to keep this file safe for client bundling.
// Pass a cookie adapter from the caller when you need SSR cookie support.
// This wrapper supports both the new cookie adapter API (get/set/remove)
// and automatically adapts legacy adapters using getAll/setAll.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createServerClient(cookiesArg?: any) {
  // Build a cookie adapter compatible with @supabase/ssr expectations
  const cookieAdapter = (() => {
    try {
      // Unwrap if passed as { cookies: adapter }
      const source = cookiesArg?.cookies ?? cookiesArg

      // If a new-style adapter was provided, use it as-is
      if (
        source &&
        typeof source.get === 'function' &&
        typeof source.set === 'function' &&
        typeof source.remove === 'function'
      ) {
        return source
      }

      // If a legacy adapter (getAll/setAll) was provided, adapt it
      if (
        source &&
        typeof source.getAll === 'function' &&
        typeof source.setAll === 'function'
      ) {
        return {
          get(name: string) {
            const all = source.getAll()
            const found = Array.isArray(all) ? all.find((c: any) => c?.name === name) : undefined
            return found?.value
          },
          set(name: string, value: string, options?: any) {
            source.setAll([{ name, value, options }])
          },
          remove(name: string, options?: any) {
            source.setAll([{ name, value: '', options }])
          },
        }
      }

      // Default: safe no-op adapter. Callers should pass a cookies adapter for SSR session support.
      return {
        get() {
          return undefined as string | undefined
        },
        set() {
          // No-op
        },
        remove() {
          // No-op
        },
      }
    } catch {
      // Safe fallback (no cookies available)
      return {
        get() {
          return undefined as string | undefined
        },
        set() {
          // No-op
        },
        remove() {
          // No-op
        },
      }
    }
  })()

  return createSSRServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: cookieAdapter,
  })
}
