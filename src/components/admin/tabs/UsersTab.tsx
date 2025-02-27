
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const UsersTab = () => {
  return (
    <Card className="cyber-card backdrop-blur-sm bg-background/50">
      <CardHeader>
        <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>User management features will be displayed here.</p>
      </CardContent>
    </Card>
  );
};
