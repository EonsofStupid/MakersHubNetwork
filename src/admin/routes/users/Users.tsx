
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/core/card';
import { Users as UsersIcon } from "lucide-react";

export default function Users() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <UsersIcon className="text-primary w-5 h-5" />
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Manage users and their permissions
          </p>
          
          <div className="space-y-2">
            <Card className="p-4 bg-muted/50 flex items-center justify-between">
              <div>
                <h3 className="font-medium">maker42</h3>
                <p className="text-sm text-muted-foreground">Maker</p>
              </div>
              <div className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded-full">
                Active
              </div>
            </Card>
            
            <Card className="p-4 bg-muted/50 flex items-center justify-between">
              <div>
                <h3 className="font-medium">admin1</h3>
                <p className="text-sm text-muted-foreground">Admin</p>
              </div>
              <div className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">
                Online
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
