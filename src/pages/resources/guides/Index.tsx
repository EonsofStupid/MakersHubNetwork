
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const GuidesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-gradient text-3xl font-heading">Build Guides</CardTitle>
          <CardDescription>
            Step-by-step guides for building your custom 3D printer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Build guides content coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuidesPage;
