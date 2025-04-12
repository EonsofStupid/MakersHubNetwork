
import React from "react";
import { AdminLayout } from "@/admin/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your system settings and preferences.
          </p>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure general system settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="site-name" className="text-sm font-medium">
                  Site Name
                </label>
                <Input id="site-name" defaultValue="My Admin" />
              </div>
              <div className="space-y-2">
                <label htmlFor="site-url" className="text-sm font-medium">
                  Site URL
                </label>
                <Input id="site-url" defaultValue="https://myadmin.com" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="admin-email" className="text-sm font-medium">
                  Admin Email
                </label>
                <Input id="admin-email" defaultValue="admin@example.com" />
              </div>
              <div className="space-y-2">
                <label htmlFor="timezone" className="text-sm font-medium">
                  Timezone
                </label>
                <Input id="timezone" defaultValue="UTC" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
