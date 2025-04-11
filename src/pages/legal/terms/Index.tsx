
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/core/card';

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-gradient text-3xl font-heading">Terms of Service</CardTitle>
          <CardDescription>
            Our terms and conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Terms of service content coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsPage;
