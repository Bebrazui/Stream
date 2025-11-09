'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/compose', label: 'Compose', icon: PlusSquare },
  { href: '/profile/currentuser', label: 'Profile', icon: User }, // Hardcoded for now
];

export function MobileBottomBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="flex h-16 items-center justify-around">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.href}>
              <div className="flex flex-col items-center gap-1">
                <item.icon
                  className={cn(
                    'h-6 w-6',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    'text-xs font-medium',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
