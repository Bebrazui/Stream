'use server';

import { getUserByUsername, getPosts } from '@/lib/actions';
import { notFound } from 'next/navigation';
import UserProfileClient from '@/components/profile/user-profile-client';

export default async function UserProfilePage({ params: { username } }: { params: { username: string } }) {
  // Fetch the user data based on the username in the URL
  const user = await getUserByUsername(username);

  // If the user for the profile page doesn't exist, show a 404 page
  if (!user) {
    notFound();
  }

  // The client component will fetch its own posts
  return <UserProfileClient profileUser={user} memberSince={new Date()} />;
}
