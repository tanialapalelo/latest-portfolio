import { use } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

async function sendMagicLink(formData: FormData) {
  'use server'
  const email = formData.get('email') as string
  const supabase = await createClient()
  await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
  })
  redirect('/admin/login?sent=1')
}

export default function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ sent?: string }>
}) {
  const { sent } = searchParams != null ? use(searchParams) : {}

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-6">
          Admin Login
        </p>
        {sent && (
          <p className="font-mono text-xs text-mint mb-4">
            Magic link sent — check your email.
          </p>
        )}
        <form action={sendMagicLink} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="font-mono text-xs text-ink-dim">Email</span>
            <input
              type="email"
              name="email"
              required
              aria-label="Email"
              className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2.5 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle"
            />
          </label>
          <button
            type="submit"
            className="bg-periwinkle text-bg font-mono text-sm px-5 py-2.5 rounded-lg hover:-translate-y-0.5 transition-transform"
          >
            Send Magic Link
          </button>
        </form>
      </div>
    </div>
  )
}
