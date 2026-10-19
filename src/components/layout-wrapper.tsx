import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface LayoutWrapperProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function LayoutWrapper({ 
  children, 
  showHeader = true, 
  showFooter = true 
}: LayoutWrapperProps) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {showHeader && <Header />}
      
      <main 
        id="main" 
        className={`flex-1 ${showHeader ? 'pt-16' : ''}`}
        role="main"
      >
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}
