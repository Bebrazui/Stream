'use client';

import { usePathname } from 'next/navigation';

export function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSearchPage = pathname.startsWith('/search');

  const containerClasses = isSearchPage ? '' : 'container mx-auto';

  return (
    <div className={`${containerClasses} h-full`}>
      {children}
    </div>
  );
}
