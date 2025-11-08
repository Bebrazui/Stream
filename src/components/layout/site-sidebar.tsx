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
  User,
  Waves,
  Settings,
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { currentUser } from '@/lib/data';

const menuItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/compose', label: 'Compose Post', icon: PlusSquare },
];

export function SiteSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="hidden items-center gap-2 md:flex">
        <Waves className="h-6 w-6 text-accent" />
        <span className="font-headline text-lg font-bold">Stream</span>
      </SidebarHeader>

      <SidebarMenu className="flex-1">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href}>
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
         <Link href={`/profile/${currentUser.username}`}>
            <SidebarMenuButton tooltip="Profile">
                <Avatar className="h-7 w-7">
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>Profile</span>
            </SidebarMenuButton>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
