
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const HomeView = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to MakersImpulse
          </h1>
          <p className="text-xl text-muted-foreground">
            Your hub for 3D printing enthusiasts and makers
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Share Your Builds</h2>
            <p className="text-muted-foreground">
              Showcase your 3D printer builds, get feedback, and connect with other makers.
            </p>
            <Button>Start Sharing</Button>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Explore Projects</h2>
            <p className="text-muted-foreground">
              Discover innovative builds, learn from the community, and find inspiration.
            </p>
            <Button variant="outline">Browse Projects</Button>
          </Card>
        </section>
      </div>
    </div>
  );
};
