
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/core/card';

const LicensesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-gradient text-3xl font-heading">Licenses</CardTitle>
          <CardDescription>
            Software and content licensing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">License information coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LicensesPage;
