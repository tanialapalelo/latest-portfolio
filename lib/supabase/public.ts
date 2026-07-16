import { createClient } from '@supabase/supabase-js'

export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: {
        fetch: (url, options) =>
          fetch(url, { ...options, next: { revalidate: 60 } } as RequestInit),
      },
    }
  )
}
