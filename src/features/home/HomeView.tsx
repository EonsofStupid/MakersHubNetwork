import { MainNav } from "@/components/MainNav";
import { BackgroundEffects } from "./components/background/BackgroundEffects";

export const HomeView = () => {
  return (
    <div className="min-h-screen">
      <BackgroundEffects />
      <main className="container mx-auto px-4 pt-24">
        <h1 className="text-4xl font-bold text-primary">Welcome to MakersImpulse</h1>
      </main>
    </div>
  );
};