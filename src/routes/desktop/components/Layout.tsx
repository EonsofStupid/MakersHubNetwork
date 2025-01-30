import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";

interface DesktopLayoutProps {
  children: React.ReactNode;
}

export const DesktopLayout = ({ children }: DesktopLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};