
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { OfflineIndicator } from "@/components/common/OfflineIndicator";
import { SkipLinks, AriaAnnouncer } from "@/components/accessibility/SkipLinks";
import { MobileBottomNav } from "./MobileBottomNav";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <SkipLinks />
      <AriaAnnouncer />
      <OfflineIndicator />
      <div className="min-h-screen flex flex-col w-full bg-background" id="navigation">
        {/* Mobile-first responsive layout */}
        <div className="flex flex-1 min-w-0">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header />
            
            <main className="flex-1 overflow-auto bg-muted/30" id="main-content" tabIndex={-1}>
              <div className="container mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-4 lg:py-6">
                {children}
              </div>
            </main>
          </div>
        </div>
        
        <Footer />
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  );
}
