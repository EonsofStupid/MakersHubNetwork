
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SettingsTab = () => {
  return (
    <Card className="cyber-card backdrop-blur-sm bg-background/50">
      <CardHeader>
        <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          System Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>System settings will be displayed here.</p>
      </CardContent>
    </Card>
  );
};
