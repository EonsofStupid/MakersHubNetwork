
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleCyberText } from "@/components/theme/SimpleCyberText";
import { Users } from "lucide-react";

const UsersPage = () => {
  return (
    <div className="space-y-6">
      <Card className="cyber-card border-primary/20 p-6">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-heading">
            <SimpleCyberText text="Users Management" />
          </h2>
        </div>
        <p className="text-muted-foreground mt-2">Manage user accounts and permissions</p>
      </Card>
      
      <Card className="cyber-card border-primary/20">
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <p>User management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
