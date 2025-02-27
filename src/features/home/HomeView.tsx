
import { Card } from "@/components/ui/card";

export const HomeView = () => {
  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold">Welcome to MakersImpulse</h1>
        <p className="mt-2">A hub for passionate makers and 3D printing enthusiasts.</p>
      </Card>
    </div>
  );
};

export default HomeView;
