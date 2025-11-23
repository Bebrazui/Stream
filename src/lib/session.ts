
import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { User } from '@/types';

// --- Environment Variables ---
const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);
const expires = '7d'; // Session expiration time

// --- Session Encryption ---
export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(encodedKey);
}

// --- Session Decryption ---
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
    return null;
  }
}

// --- Session Management ---

/**
 * Creates a session for the given user and sets the cookie.
 * This is a server-side action.
 */
export async function createSession(user: User) {
    console.log("--- SESSION: Creating session for user:", user.username);
    const sessionPayload = { user, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) };
    const session = await encrypt(sessionPayload);
    
    const cookieStore = cookies();
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: sessionPayload.expires,
    });
    console.log("--- SESSION: Cookie set successfully.");
}

/**
 * Retrieves the current user from the session cookie.
 * Returns the user object or null if not authenticated.
 * This is a server-side action.
 */
export async function getSessionUser(): Promise<User | null> {
    console.log("--- SESSION: Attempting to get session user.");
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
        console.log("--- SESSION: No session cookie found.");
        return null;
    }

    const decrypted = await decrypt(sessionCookie);

    if (decrypted && decrypted.user) {
         console.log("--- SESSION: User found in session:", (decrypted.user as User).username);
        return decrypted.user as User;
    }
    
    console.log("--- SESSION: Session found but no user data inside.");
    return null;
}

/**
 * Deletes the session cookie.
 * This is a server-side action.
 */
export async function deleteSession() {
    console.log("--- SESSION: Deleting session cookie.");
    const cookieStore = cookies();
    cookieStore.delete('session');
    console.log("--- SESSION: Cookie deleted.");
}
