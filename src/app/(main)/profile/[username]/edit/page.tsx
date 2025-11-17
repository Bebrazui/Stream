import { EditProfileForm } from '@/components/profile/edit-profile-form';
import { getUsers, updateProfile } from '@/lib/actions';
import { notFound } from 'next/navigation';

// This is a server component that fetches the user's current data
export default async function EditProfilePage({ params }: { params: { username: string } }) {

  const users = await getUsers();
  const user = users.find(u => u.username === params.username);

  if (!user) {
      notFound();
  }

  // The main component render
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-headline text-3xl font-bold">Edit Profile</h1>
      <EditProfileForm user={user} updateUserAction={updateProfile} />
    </div>
  );
}
