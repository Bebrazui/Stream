import { users, posts, currentUser } from '@/lib/data';
import { notFound } from 'next/navigation';
import { UserProfileClient } from '@/components/profile/user-profile-client';

export async function generateStaticParams() {
    return [...users, currentUser].map((user) => ({
      username: user.username,
    }));
}

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const allUsers = [...users, currentUser];
  const user = allUsers.find((u) => u.username === params.username);

  if (!user) {
    notFound();
  }

  const userPosts = posts.filter((post) => post.author.id === user.id);
  const isCurrentUserProfile = user.id === currentUser.id;

  return <UserProfileClient user={user} posts={userPosts} isCurrentUserProfile={isCurrentUserProfile} />;
}
