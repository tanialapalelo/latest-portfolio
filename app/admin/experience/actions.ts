'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createExperience(formData: FormData) {
  const supabase = await createClient()
  await supabase.from('experiences').insert({
    title: formData.get('title') as string,
    company: formData.get('company') as string,
    location: formData.get('location') as string,
    period: formData.get('period') as string,
    accent: formData.get('accent') as string,
    bullets: (formData.get('bullets') as string).split('\n').map(b => b.trim()).filter(Boolean),
    sort_order: Number(formData.get('sort_order') ?? 0),
  })
  revalidatePath('/')
  redirect('/admin/experience')
}

export async function updateExperience(id: string, formData: FormData) {
  const supabase = await createClient()
  await supabase.from('experiences').update({
    title: formData.get('title') as string,
    company: formData.get('company') as string,
    location: formData.get('location') as string,
    period: formData.get('period') as string,
    accent: formData.get('accent') as string,
    bullets: (formData.get('bullets') as string).split('\n').map(b => b.trim()).filter(Boolean),
    sort_order: Number(formData.get('sort_order') ?? 0),
  }).eq('id', id)
  revalidatePath('/')
  redirect('/admin/experience')
}

export async function deleteExperience(id: string) {
  const supabase = await createClient()
  await supabase.from('experiences').delete().eq('id', id)
  revalidatePath('/')
  redirect('/admin/experience')
}
