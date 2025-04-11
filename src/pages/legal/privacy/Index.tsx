
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/core/card';

const PrivacyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-gradient text-3xl font-heading">Privacy Policy</CardTitle>
          <CardDescription>
            How we protect and handle your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Privacy policy content coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPage;
