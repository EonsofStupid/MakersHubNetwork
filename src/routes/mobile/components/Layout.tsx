import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1 px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};