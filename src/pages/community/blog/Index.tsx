
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BlogPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-gradient text-3xl font-heading">Blog</CardTitle>
          <CardDescription>
            Latest news and updates from the MakersImpulse community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Blog posts coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPage;
