'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusSquare, Waves } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';
import { useInteraction } from '@/context/interaction-context';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/home', label: 'Home', icon: Home, requiresAuth: false },
  { href: '/search', label: 'Search', icon: Search, requiresAuth: false },
  { href: '/compose', label: 'Compose Post', icon: PlusSquare, requiresAuth: true },
];

// A sidebar that blends into the dark parallax background
export function SiteSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { requireAuth } = useInteraction();

  const handleMenuClick = (item: typeof menuItems[0], e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.requiresAuth && !user) {
      e.preventDefault();
      requireAuth();
    }
  };

  return (
    <aside className="h-full w-full flex flex-col p-4 text-white/90">
      {/* Header */}
      <div className="flex items-center gap-2 px-2 py-4">
        <Waves className="h-7 w-7 text-sky-400" />
        <span className="text-xl font-bold">Stream</span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              onClick={(e) => handleMenuClick(item, e)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-medium transition-colors',
                'text-white/80 hover:bg-white/10 hover:text-white',
                isActive && 'bg-white/20 text-white'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer - User Profile or Login Button */}
      <div className="mt-auto">
        {user ? (
            <Link href={`/profile/${user.username}`}>
                <div className="flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors">
                    <Avatar className="h-8 w-8 border border-white/30">
                        <AvatarImage src={user.avatarUrl ?? ''} alt={user.username} />
                        <AvatarFallback className="bg-black/20">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">Profile</span>
                </div>
            </Link>
        ) : (
          <button
            onClick={() => requireAuth()}
            className="w-full rounded-full border border-white/20 bg-transparent py-3 text-lg font-semibold text-white/90 transition-all hover:bg-white/10"
          >
            Login
          </button>
        )}
      </div>
    </aside>
  );
}
