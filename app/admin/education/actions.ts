'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateEducation(id: string, formData: FormData) {
  const supabase = await createClient()
  await supabase.from('education').update({
    degree: formData.get('degree') as string,
    institution: formData.get('institution') as string,
    year: formData.get('year') as string,
    certifications: (formData.get('certifications') as string)
      .split('\n')
      .map(c => c.trim())
      .filter(Boolean),
  }).eq('id', id)
  revalidatePath('/')
}
