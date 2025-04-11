
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CareersPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-gradient text-3xl font-heading">Careers</CardTitle>
          <CardDescription>
            Join our team and help shape the future of 3D printing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Career opportunities coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareersPage;
