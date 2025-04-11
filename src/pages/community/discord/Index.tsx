
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/core/card';

const DiscordPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-gradient text-3xl font-heading">Discord Community</CardTitle>
          <CardDescription>
            Join our real-time community chat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Discord integration coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscordPage;
