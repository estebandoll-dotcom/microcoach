'use server'

import { createClient } from '@/lib/supabase/server';
import { PushupSchema, ProfileSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function addPushupSet(data: { amount: number, dateStr: string }) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');
  
  const parsed = PushupSchema.safeParse(data);
  if (!parsed.success) throw new Error('Invalid input validation');

  const { error } = await supabase.from('pushup_entries').insert({
    user_id: user.id,
    amount: parsed.data.amount,
    date_str: parsed.data.dateStr
  });

  if (error) {
    console.error('DB Insert Error:', error); 
    throw new Error('Kon voortgang niet opslaan.');
  }
  
  revalidatePath('/');
  revalidatePath('/history');
}

export async function deletePushupSet(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase.from('pushup_entries').delete().eq('id', id).eq('user_id', user.id);
  if (error) throw new Error('Could not delete entry');

  revalidatePath('/history');
  revalidatePath('/');
}

export async function updateProfile(data: { daily_goal?: number, reminder_time?: string | null }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const parsed = ProfileSchema.safeParse(data);
  if (!parsed.success) throw new Error('Invalid input');

  const { error } = await supabase.from('profiles').update(parsed.data).eq('id', user.id);
  if (error) throw new Error('Could not update profile');

  revalidatePath('/settings');
  revalidatePath('/');
}
