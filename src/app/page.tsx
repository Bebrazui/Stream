'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <p className="text-white">Loading...</p>
    </div>
  );
}
