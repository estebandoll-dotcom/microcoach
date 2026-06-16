import { z } from 'zod';

export const PushupSchema = z.object({
  amount: z.number().int().min(1).max(5000, "Be realistic!"),
  dateStr: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
});

export const ProfileSchema = z.object({
  daily_goal: z.number().int().min(1).max(10000).optional(),
  reminder_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format").nullable().optional(),
});
