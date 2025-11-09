'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusSquare, User, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useInteraction } from '@/context/interaction-context';

export function MobileBottomBar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { requireAuth } = useInteraction();

  const menuItems = [
    { href: '/home', label: 'Home', icon: Home, requiresAuth: false },
    { href: '/search', label: 'Search', icon: Search, requiresAuth: false },
    { href: '/compose', label: 'Post', icon: PlusSquare, requiresAuth: true },
    // The profile link is now dynamic
    user
      ? { href: `/profile/${user.username}`, label: 'Profile', icon: User, requiresAuth: true }
      : { href: '#', label: 'Login', icon: LogIn, requiresAuth: true, isLoginButton: true },
  ];

  const handleMenuClick = (item: any, e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    if (item.requiresAuth && !requireAuth()) {
      e.preventDefault();
    }
  };

  return (
    <nav className="fixed bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="flex h-16 items-center justify-around">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          if (item.isLoginButton) {
            return (
                <div key={item.label} className="flex flex-col items-center gap-1 cursor-pointer" onClick={(e) => handleMenuClick(item, e)}>
                    <item.icon
                      className={cn('h-6 w-6', 'text-muted-foreground')}
                      strokeWidth={2}
                    />
                    <span className={cn('text-xs font-medium', 'text-muted-foreground')}>
                      {item.label}
                    </span>
                </div>
            )
          }

          return (
            <Link href={item.href} key={item.href} onClick={(e) => handleMenuClick(item, e)}>
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
