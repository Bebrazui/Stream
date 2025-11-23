
import { z } from 'zod';

// This file is kept for schema definitions and type safety, but the logic
// for authentication (login, register, etc.) is now primarily in `actions.ts`.

/**
 * Represents the data required for authentication actions (login/register).
 * Used for form validation with Zod.
 */
export const authSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters.")
        .max(20, "Username cannot be longer than 20 characters.")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
    password: z.string()
        .min(6, "Password must be at least 6 characters.")
        .max(100, "Password is too long."),
    
    // Optional fields for things like CAPTCHA
    captchaAnswer: z.string().optional(),
    captchaToken: z.string().optional(),
});

/**
 * Represents the shape of the data returned after a successful authentication attempt.
 */
export const authResultSchema = z.object({
    success: z.boolean(),
    user: z.object({
        id: z.string(),
        username: z.string(),
        name: z.string(),
        avatarUrl: z.string().url().optional(),
    }).optional(),
    error: z.string().optional(),
    // You could add other fields here like `requiresTwoFactor`, etc.
});

// Type alias for convenience
export type AuthInput = z.infer<typeof authSchema>;
export type AuthResult = z.infer<typeof authResultSchema>;
