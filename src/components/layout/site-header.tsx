'use client';

import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Waves } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function SiteHeader() {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-card px-4 sm:px-6">
      <div className="flex items-center gap-4">
        {isMobile && <SidebarTrigger />}
        <Link href="/home" className="flex items-center gap-2">
          <Waves className="h-6 w-6 text-accent" />
          <span className="font-headline text-lg font-bold">Stream</span>
        </Link>
      </div>
    </header>
  );
}
