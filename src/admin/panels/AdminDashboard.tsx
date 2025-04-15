
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to the admin dashboard. Manage your content, users, and settings here.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Parts Management</CardTitle>
            <CardDescription>
              Manage parts in the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Total parts: 0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Total users: 0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Builds</CardTitle>
            <CardDescription>
              Manage community builds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Total builds: 0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
