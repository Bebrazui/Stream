'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Home,
  Search,
  PlusSquare,
  Waves,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';
import { useInteraction } from '@/context/interaction-context';
import { Button } from '@/components/ui/button';


const menuItems = [
  { href: '/home', label: 'Home', icon: Home, requiresAuth: false },
  { href: '/search', label: 'Search', icon: Search, requiresAuth: false },
  { href: '/compose', label: 'Compose Post', icon: PlusSquare, requiresAuth: true },
];

export function SiteSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { requireAuth } = useInteraction();

  const handleMenuClick = (item: typeof menuItems[0], e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.requiresAuth && !requireAuth()) {
      e.preventDefault();
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="hidden items-center gap-2 md:flex">
        <Waves className="h-6 w-6 text-accent" />
        <span className="font-headline text-lg font-bold">Stream</span>
      </SidebarHeader>

      <SidebarMenu className="flex-1">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} onClick={(e) => handleMenuClick(item, e)}>
              <SidebarMenuButton
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarFooter className="p-2">
        {user ? (
             <Link href={`/profile/${user.username}`}>
                <SidebarMenuButton tooltip="Profile">
                    <Avatar className="h-7 w-7">
                        <AvatarImage src={user.avatarUrl ?? ''} alt={user.username} />
                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>Profile</span>
                </SidebarMenuButton>
            </Link>
        ) : (
          <div className="flex flex-col items-stretch px-2">
            <Button onClick={() => requireAuth()}>Login</Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
