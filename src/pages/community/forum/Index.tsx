
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ForumPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-gradient text-3xl font-heading">Community Forum</CardTitle>
          <CardDescription>
            Connect with other makers and share your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Forum content coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForumPage;
