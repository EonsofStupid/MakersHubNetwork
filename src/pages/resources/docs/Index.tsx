
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DocsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-gradient text-3xl font-heading">Documentation</CardTitle>
          <CardDescription>
            Learn how to build and customize your 3D printer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Documentation content coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocsPage;
