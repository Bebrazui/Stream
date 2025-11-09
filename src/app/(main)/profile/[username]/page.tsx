import { getPosts, getUsers } from '@/lib/actions';
import { notFound } from 'next/navigation';
import { UserProfileClient } from '@/components/profile/user-profile-client';
import { User } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Helper to get unique users, combining remote posts and local user data
async function getCombinedUsers(): Promise<User[]> {
    const posts = await getPosts();
    const remoteUsers = new Map<string, User>();
    posts.forEach(post => {
        if (!remoteUsers.has(post.author.username)) {
            remoteUsers.set(post.author.username, post.author);
        }
    });

    // Get locally stored user data, which may contain updated bios/avatars
    const localUsers = await getUsers();
    const localUsersMap = new Map<string, User>(localUsers.map(u => [u.username, u]));

    // Merge local data into remote data
    remoteUsers.forEach((user, username) => {
        if (localUsersMap.has(username)) {
            const localUser = localUsersMap.get(username)!;
            user.name = localUser.name; // Always take local name
            user.bio = localUser.bio;     // and bio
            user.avatarUrl = localUser.avatarUrl; // and avatar
        }
    });

    // Ensure 'currentuser' is always in the list, pulling from local data if possible
    if (!remoteUsers.has('currentuser')) {
        const currentUserFromLocal = localUsersMap.get('currentuser');
        remoteUsers.set('currentuser', currentUserFromLocal || {
            id: 'user-current-placeholder',
            name: 'You',
            username: 'currentuser',
            avatarUrl: 'https://picsum.photos/seed/currentUser/200/200',
            bio: 'This is your default bio. Feel free to edit it!'
        });
    }

    return Array.from(remoteUsers.values());
}

export async function generateStaticParams() {
    const users = await getCombinedUsers();
    return users.map((user) => ({
      username: user.username,
    }));
}

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const allUsers = await getCombinedUsers();
  const user = allUsers.find((u) => u.username === params.username);

  if (!user) {
    notFound();
  }

  const allPosts = await getPosts();
  const userPosts = allPosts.filter((post) => post.author.username === user.username);
  const isCurrentUserProfile = user.username === 'currentuser';

  // We need to inject the Edit button into the client component now
  // Or better, handle the navigation inside the client component
  return <UserProfileClient user={user} posts={userPosts} isCurrentUserProfile={isCurrentUserProfile} />;
}
