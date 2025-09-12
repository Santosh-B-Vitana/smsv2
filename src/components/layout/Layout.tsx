
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-background">
        {/* Mobile-first responsive layout */}
        <div className="flex flex-1 min-w-0">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header />
            
            <main className="flex-1 overflow-auto bg-muted/30">
              <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-6">
                {children}
              </div>
            </main>
          </div>
        </div>
        
        <Footer />
      </div>
    </SidebarProvider>
  );
}
