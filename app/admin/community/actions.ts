'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCommunityEntry(formData: FormData) {
  const supabase = await createClient()
  await supabase.from('community').insert({
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    href: formData.get('href') as string,
    accent: formData.get('accent') as string,
    sort_order: Number(formData.get('sort_order') ?? 0),
  })
  revalidatePath('/')
  redirect('/admin/community')
}

export async function updateCommunityEntry(id: string, formData: FormData) {
  const supabase = await createClient()
  await supabase.from('community').update({
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    href: formData.get('href') as string,
    accent: formData.get('accent') as string,
    sort_order: Number(formData.get('sort_order') ?? 0),
  }).eq('id', id)
  revalidatePath('/')
  redirect('/admin/community')
}

export async function deleteCommunityEntry(id: string) {
  const supabase = await createClient()
  await supabase.from('community').delete().eq('id', id)
  revalidatePath('/')
  redirect('/admin/community')
}
