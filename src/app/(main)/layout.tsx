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
      {/* 
        The layout has been radically simplified. 
        Removed all `h-screen`, `overflow`, and `flex-1` properties.
        This allows the entire page to scroll naturally as one document, which is the most robust solution.
      */}
      <div className="w-full">
        <SiteHeader />
        <div className="grid grid-cols-12 gap-x-6 px-4 sm:px-6 lg:gap-x-8">
          
          <aside className="hidden md:col-span-3 lg:col-span-2 md:block">
             {/* The sidebars remain sticky to the top of the viewport as the page scrolls. */}
             <div className="sticky top-20">
                <SiteSidebar />
             </div>
          </aside>

          <main className="col-span-12 md:col-span-9 lg:col-span-7 py-4">
            {children}
          </main>

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
