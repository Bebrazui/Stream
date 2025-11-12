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
          <div className="flex-1 flex overflow-y-hidden">
            
            <aside className="hidden md:block w-[280px] overflow-y-auto py-4 pl-6 no-scrollbar">
               <SiteSidebar />
            </aside>

            <main className="flex-1 h-full overflow-y-auto">
              <div className="container mx-auto h-full">
                {children}
              </div>
            </main>

            <aside className="hidden lg:block w-[350px] overflow-y-auto py-4 pr-6 no-scrollbar">
              <RightSidebar />
            </aside>

          </div>
          <MobileBottomBar />
        </div>
      </AuthModalController>
    </SidebarProvider>
  );
}
