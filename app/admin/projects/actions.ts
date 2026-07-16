'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  await supabase.from('projects').insert({
    slug: formData.get('slug') as string,
    case_study_number: formData.get('case_study_number') as string,
    tagline: formData.get('tagline') as string,
    accent: formData.get('accent') as string,
    tech: (formData.get('tech') as string).split(',').map(t => t.trim()).filter(Boolean),
    sort_order: Number(formData.get('sort_order') ?? 0),
  })
  revalidatePath('/')
  redirect('/admin/projects')
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient()
  await supabase.from('projects').update({
    slug: formData.get('slug') as string,
    case_study_number: formData.get('case_study_number') as string,
    tagline: formData.get('tagline') as string,
    accent: formData.get('accent') as string,
    tech: (formData.get('tech') as string).split(',').map(t => t.trim()).filter(Boolean),
    sort_order: Number(formData.get('sort_order') ?? 0),
  }).eq('id', id)
  revalidatePath('/')
  redirect('/admin/projects')
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  await supabase.from('projects').delete().eq('id', id)
  revalidatePath('/')
  redirect('/admin/projects')
}
