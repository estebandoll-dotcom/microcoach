'use server'

import { createClient } from '@/lib/supabase/server';
import { ActivityEntrySchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function addActivityEntry(data: { activityType: string, amount: number, dateStr: string }) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');
  
  const parsed = ActivityEntrySchema.safeParse(data);
  if (!parsed.success) throw new Error('Invalid input validation');

  const { error } = await supabase.from('activity_entries').insert({
    user_id: user.id,
    activity_type: parsed.data.activityType,
    amount: parsed.data.amount,
    date_str: parsed.data.dateStr
  });

  if (error) {
    console.error('DB Insert Error:', error); 
    throw new Error('Kon voortgang niet opslaan.');
  }

  // Update current streak (simplified logic for now, usually done with a cron or better SQL function)
  // For now, we will just increment total/streak blindly if they met the goal in the UI logic or just revalidate.
  
  revalidatePath('/');
  revalidatePath('/history');
  revalidatePath('/stats');
}

export async function deleteActivityEntry(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase.from('activity_entries').delete().eq('id', id).eq('user_id', user.id);
  if (error) throw new Error('Could not delete entry');

  revalidatePath('/history');
  revalidatePath('/history');
  revalidatePath('/');
  revalidatePath('/stats');
}

export async function updateUserActivity(activityType: string, data: { daily_goal: number }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('user_activities')
    .update({ daily_goal: data.daily_goal })
    .eq('user_id', user.id)
    .eq('activity_type', activityType);

  if (error) throw new Error('Could not update profile');

  revalidatePath('/settings');
  revalidatePath('/');
}
