import { z } from 'zod';

export const ActivityEntrySchema = z.object({
  activityType: z.enum(['pushups', 'walking', 'squats', 'crunches']),
  amount: z.number().int().min(1).max(20000, "Onrealistisch bedrag!"),
  dateStr: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
});

export const UserActivitiesSchema = z.object({
  activityType: z.enum(['pushups', 'walking', 'squats', 'crunches']),
  daily_goal: z.number().int().min(1).max(20000),
});
