'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusSquare, Waves, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthModal } from '@/hooks/use-auth-modal';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/home', label: 'Home', icon: Home, requiresAuth: false },
  { href: '/search', label: 'Search', icon: Search, requiresAuth: false },
  { href: '/compose', label: 'Compose Post', icon: PlusSquare, requiresAuth: true },
];

export function SiteSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { openModal } = useAuthModal();

  const handleMenuClick = (item: typeof menuItems[0], e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.requiresAuth && !user) {
      e.preventDefault();
      openModal('login');
    }
  };

  return (
    <aside className="h-full w-full flex flex-col p-4 text-white/90">
      <div className="flex items-center gap-2 px-2 py-4">
        <Waves className="h-7 w-7 text-sky-400" />
        <span className="text-xl font-bold">Stream</span>
      </div>

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

      <div className="mt-auto space-y-2">
        {user ? (
          <>
            <Link href={`/profile/${user.username}`}>
                <div className="flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors">
                    <Avatar className="h-8 w-8 border border-white/30">
                        <AvatarImage src={user.avatarUrl ?? ''} alt={user.username} />
                        <AvatarFallback className="bg-black/20">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">Profile</span>
                </div>
            </Link>
            <Link href="/settings/profile">
                <div className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-medium transition-colors',
                    'text-white/80 hover:bg-white/10 hover:text-white',
                    pathname.startsWith('/settings') && 'bg-white/20 text-white'
                  )}>
                    <Settings className="h-6 w-6" />
                    <span>Settings</span>
                </div>
            </Link>
          </>
        ) : (
          <div className="space-y-3 pt-4">
            <button
              onClick={() => openModal('register')}
              className="w-full rounded-full bg-sky-500 py-3 text-lg font-bold text-white transition-all hover:bg-sky-600"
            >
              Register
            </button>
            <button
              onClick={() => openModal('login')}
              className="w-full rounded-full border border-white/20 bg-transparent py-3 text-lg font-semibold text-white/90 transition-all hover:bg-white/10"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
