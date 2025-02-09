
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const SettingsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Settings</CardTitle>
        <CardDescription>Configure global platform settings</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Settings configuration coming soon...</p>
      </CardContent>
    </Card>
  );
};

