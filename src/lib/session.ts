'use server';

import { cookies } from 'next/headers';
import { IronSession, getIronSession, sealData, unsealData } from 'iron-session';
import { User } from '@/types';

const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'user-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

// This is the session data that will be encrypted in the cookie
interface SessionData {
  user?: User;
  captcha?: string;
}

async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(cookies(), sessionOptions);
}

async function createSession(user: User) {
    const session = await getSession();
    session.user = user;
    await session.save();
}

async function getSessionUser(): Promise<User | null> {
    const session = await getSession();
    return session.user ?? null;
}

async function deleteSession() {
    const session = await getSession();
    session.destroy();
}

async function updateSession(data: Partial<SessionData>) {
    const session = await getSession();
    Object.assign(session, data);
    await session.save();
}

export {
    getSession,
    createSession,
    getSessionUser,
    deleteSession,
    updateSession,
    type SessionData,
};
