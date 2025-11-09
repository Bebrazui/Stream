import { EditProfileForm } from '@/components/profile/edit-profile-form';
import { getUsers, updateUserProfile } from '@/lib/actions';
import { notFound } from 'next/navigation';

// This is a server component that fetches the user's current data
export default async function EditProfilePage({ params }: { params: { username: string } }) {
  // For now, we hardcode this to only allow editing the 'currentuser' profile
  if (params.username !== 'currentuser') {
    notFound();
  }

  const users = await getUsers();
  const currentUser = users.find(u => u.username === 'currentuser');

  const user = {
    name: currentUser?.name || 'New User',
    bio: currentUser?.bio || '',
    avatarUrl: currentUser?.avatarUrl || '',
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-headline text-3xl font-bold">Edit Profile</h1>
      <EditProfileForm user={user} updateUserAction={updateUserProfile} />
    </div>
  );
}
