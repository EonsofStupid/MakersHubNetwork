
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UsersManagement = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading cyber-text-glow">Users Management</h2>
      
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

export default UsersManagement;
