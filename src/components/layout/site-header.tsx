'use client';

import Link from 'next/link';
import { Waves } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/auth-context';
import { useInteraction } from '@/context/interaction-context';
import { Button } from '@/components/ui/button';
import { UserNav } from './user-nav';

export function SiteHeader() {
  const isMobile = useIsMobile();
  const { user, isLoading } = useAuth();
  const { requireAuth } = useInteraction();

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-card px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Link href="/home" className="flex items-center gap-2">
          <Waves className="h-6 w-6 text-accent" />
          <span className="font-headline text-lg font-bold">Stream</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {isLoading ? (
          <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div>
        ) : user ? (
          <UserNav user={user} />
        ) : (
          <Button onClick={() => requireAuth()}>Login</Button>
        )}
      </div>
    </header>
  );
}
