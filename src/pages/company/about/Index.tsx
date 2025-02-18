
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-gradient text-3xl font-heading">About Us</CardTitle>
          <CardDescription>
            Learn about our mission and values
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">About content coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
