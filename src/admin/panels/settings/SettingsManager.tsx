
import React from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  Tabs, TabsContent, TabsList, TabsTrigger,
  Button,
  Input,
  Label,
  Switch
} from "@/shared/ui/ui-components";
import { useToast } from "@/shared/ui/use-toast";

export default function SettingsManager() {
  const { toast } = useToast();
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully."
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings
        </p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>
                Configure general site settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input id="site-name" defaultValue="MakersImpulse" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="site-description">Site Description</Label>
                  <Input id="site-description" defaultValue="A hub for passionate makers building, customizing, and sharing 3D printer builds." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input id="contact-email" type="email" defaultValue="contact@makersimpulse.com" />
                </div>
              </div>
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Maintenance Mode</Label>
                  <div className="flex items-center gap-2">
                    <Switch id="maintenance-mode" />
                    <span className="text-sm text-muted-foreground">Enable maintenance mode</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    When enabled, the site will display a maintenance message to visitors.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>User Registration</Label>
                  <div className="flex items-center gap-2">
                    <Switch id="allow-registration" defaultChecked />
                    <span className="text-sm text-muted-foreground">Allow new user registrations</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Defaults</CardTitle>
              <CardDescription>
                Default settings for new users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default User Role</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Button variant="outline" className="justify-start">Builder</Button>
                  <Button variant="outline" className="justify-start bg-primary/10">
                    Maker
                  </Button>
                  <Button variant="outline" className="justify-start">Designer</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Email Verification</Label>
                <div className="flex items-center gap-2">
                  <Switch id="email-verification" defaultChecked />
                  <span className="text-sm text-muted-foreground">Require email verification</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the appearance of your site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Appearance settings will be implemented in the future.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
