'use client';

import Link from 'next/link';
import { Waves } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { UserNav } from './user-nav';

export function SiteHeader() {
  const { user, isLoading } = useAuth();

  return (
    <header 
      // Sticky header that blurs content scrolling underneath it
      className="sticky top-0 z-40 w-full flex h-16 items-center justify-between border-b border-white/20 bg-black/30 px-4 backdrop-blur-xl sm:px-6"
    >
      <Link href="/" className="flex items-center gap-2">
        <Waves className="h-6 w-6 text-neon-sky-blue" />
        <span className="text-lg font-bold text-white/90">Stream</span>
      </Link>
      
      <div className="flex items-center gap-4">
        {isLoading ? (
          <div className="h-9 w-24 rounded-full bg-white/10"></div>
        ) : user ? (
          <UserNav />
        ) : (
          <Button 
            variant="ghost"
            className="rounded-full border border-white/20 bg-white/10 text-white/90 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
