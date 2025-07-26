// lib/validations/user.ts
import { z } from 'zod';

// Base user schema (shared between frontend and backend)
export const userSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  Email: z.string().email('Please enter a valid email address'),
  phone: z.string()
    .regex(/^[\d\s+-]*$/, 'Please enter a valid phone number')
    .optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters'),
    // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    // .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Schema for updating user (password optional, required only if checkbox checked)
export const updateUserSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  Email: z.string().email('Please enter a valid email address'),
  phone: z.string()
    .regex(/^[\d\s+-]*$/, 'Please enter a valid phone number')
    .optional(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).superRefine((data, ctx) => {
  // If password or confirmPassword is filled (means checkbox checked), validate:
  if (data.password || data.confirmPassword) {
    if (!data.password || data.password.length < 8) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 8 characters",
      });
    }
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
      });
    }
  }
});