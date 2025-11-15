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
        <div className="w-full max-w-7xl mx-auto flex">
          {/* Left Sidebar - sticky */}
          <aside className="hidden md:block w-[280px] h-screen sticky top-0 py-4 pr-4">
             <SiteSidebar />
          </aside>

          {/* Main Content with Header */}
          <div className="flex-1 border-x border-white/20">
            <SiteHeader />
            <main className="h-full">
              {children}
            </main>
          </div>

          {/* Right Sidebar - sticky */}
          <aside className="hidden lg:block w-[350px] h-screen sticky top-0 py-4 pl-4">
            <RightSidebar />
          </aside>
        </div>
        
        {/* Mobile bottom bar is outside the main flex container */}
        <MobileBottomBar />

      </AuthModalController>
    </SidebarProvider>
  );
}
