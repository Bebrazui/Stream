import { SiteHeader } from '@/components/layout/site-header';
import { SiteSidebar } from '@/components/layout/site-sidebar';
import { MobileBottomBar } from '@/components/layout/mobile-bottom-bar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/* The outer container has a fixed height of the screen and hides overflow */}
      <div className="flex h-screen flex-col overflow-hidden">
        <SiteHeader />
        {/* The grid now takes up the remaining space and allows the main column to handle its own overflow */}
        <div className="grid w-full flex-1 grid-cols-12 gap-x-6 overflow-hidden px-4 sm:px-6 lg:gap-x-8">
          
          {/* Left Sidebar: Stays sticky */}
          <aside className="hidden md:col-span-3 lg:col-span-2 md:block">
             <div className="sticky top-20">
                <SiteSidebar />
             </div>
          </aside>

          {/* Main Content: A non-scrolling container that provides a height context for its children */}
          <main className="col-span-12 md:col-span-9 lg:col-span-7">
            {children}
          </main>

          {/* Right Sidebar: Stays sticky */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-20">
                <RightSidebar />
            </div>
          </aside>

        </div>
        <MobileBottomBar />
      </div>
    </SidebarProvider>
  );
}
