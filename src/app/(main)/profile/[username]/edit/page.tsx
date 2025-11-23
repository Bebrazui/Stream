import EditProfileForm from '@/components/profile/edit-profile-form';

// This is a server component that fetches the user's current data
export default async function EditProfilePage() {

  // The main component render
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-headline text-3xl font-bold">Edit Profile</h1>
      <EditProfileForm closeDialog={() => {}} />
    </div>
  );
}
