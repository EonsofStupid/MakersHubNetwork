
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/core/card';

const TutorialsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-gradient text-3xl font-heading">Tutorials</CardTitle>
          <CardDescription>
            Learn from our community's best practices and tips
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Tutorials content coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorialsPage;
