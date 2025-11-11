import { SiteHeader } from '@/components/layout/site-header';
import { SiteSidebar } from '@/components/layout/site-sidebar';
import { MobileBottomBar } from '@/components/layout/mobile-bottom-bar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthModalController } from '@/components/auth/auth-modal-controller';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AuthModalController>
        <div className="flex flex-col h-screen bg-background">
          <SiteHeader />
          <div className="flex-1 grid grid-cols-12 gap-x-6 px-4 sm:px-6 lg:gap-x-8 overflow-y-hidden">
            
            <aside className="hidden md:col-span-3 lg:col-span-2 md:block overflow-y-auto py-4 no-scrollbar">
               <SiteSidebar />
            </aside>

            <div className="hidden md:block col-span-1 h-full border-r border-border -ml-4 -mr-4"></div>

            <main className="col-span-12 md:col-span-8 lg:col-span-6 h-full overflow-y-auto">
              {children}
            </main>

            <div className="hidden lg:block col-span-1 h-full border-l border-border -ml-8 -mr-8"></div>

            <aside className="hidden lg:col-span-2 lg:block overflow-y-auto py-4 no-scrollbar">
              <RightSidebar />
            </aside>

          </div>
          <MobileBottomBar />
        </div>
      </AuthModalController>
    </SidebarProvider>
  );
}
