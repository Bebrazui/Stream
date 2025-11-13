'use server';

import 'server-only';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { User } from '@/types';
import crypto from 'crypto';
import { promisify } from 'util';

const { CRYPTO_SECRET_KEY } = process.env;

if (!CRYPTO_SECRET_KEY || CRYPTO_SECRET_KEY.length !== 64) {
    throw new Error('CRYPTO_SECRET_KEY must be a 64-character hex string (32 bytes).');
}

const ENCRYPTION_KEY = Buffer.from(CRYPTO_SECRET_KEY, 'hex');
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

const sessionSchema = z.object({
    user: z.object({
        id: z.string(),
        username: z.string(),
        name: z.string(),
        avatarUrl: z.string().url(),
    }),
    createdAt: z.number(),
});

type SessionPayload = z.infer<typeof sessionSchema>;

function encrypt(data: Buffer): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

function decrypt(data: string): Buffer {
    const buffer = Buffer.from(data, 'base64');
    const iv = buffer.subarray(0, IV_LENGTH);
    const authTag = buffer.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = buffer.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}


export async function createSession(user: User) {
    const payload: SessionPayload = {
        user: {
            id: user.id,
            username: user.username,
            name: user.name,
            avatarUrl: user.avatarUrl,
        },
        createdAt: Date.now(),
    };

    const stringifiedPayload = JSON.stringify(payload);
    const encryptedSession = encrypt(Buffer.from(stringifiedPayload));

    cookies().set('session', encryptedSession, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
        sameSite: 'strict',
    });
}

export async function getSessionUser(): Promise<User | null> {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
        return null;
    }

    try {
        const decrypted = decrypt(sessionCookie);
        const payload = JSON.parse(decrypted.toString());
        
        const validated = sessionSchema.safeParse(payload);
        if (!validated.success) {
             console.error("Session validation failed:", validated.error);
             await deleteSession();
             return null;
        }

        return validated.data.user;
    } catch (error) {
        console.error("Failed to decrypt or parse session, deleting invalid cookie:", error);
        await deleteSession();
        return null;
    }
}

export async function deleteSession() {
    cookies().delete('session', { path: '/', sameSite: 'strict' });
}
