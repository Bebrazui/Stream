'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MainPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  // Render a loading state or a blank page while redirecting
  return (
    <div className="w-full h-screen flex items-center justify-center">
       <p>Loading...</p>
    </div>
  )
}
