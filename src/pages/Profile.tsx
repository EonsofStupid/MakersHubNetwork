
import React from 'react';
import { useAuthStore } from '@/stores/auth/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Profile</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email || 'Not available'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="font-medium">{user?.id || 'Not available'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
