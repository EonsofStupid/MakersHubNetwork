
import { MainNav } from "./MainNav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <MainNav />
      </div>
    </header>
  );
}
