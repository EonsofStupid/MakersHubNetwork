
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users as UsersIcon, UserCheck, UserX, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/stores/admin/store";

const MOCK_USERS = [
  { id: "1", name: "John Smith", email: "john@example.com", role: "admin", status: "active" },
  { id: "2", name: "Jane Doe", email: "jane@example.com", role: "user", status: "active" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "builder", status: "inactive" },
];

const Users = () => {
  const { toast } = useToast();
  const { isLoadingPermissions, hasPermission } = useAdminStore();

  useEffect(() => {
    // Initialize any data or state needed for the Users page
    console.log("Users admin page mounted");
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge variant="default" className="bg-green-500">Active</Badge>;
    }
    return <Badge variant="secondary" className="bg-gray-400">Inactive</Badge>;
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500">Admin</Badge>;
      case "super_admin":
        return <Badge className="bg-red-500">Super Admin</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  if (isLoadingPermissions) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasPermission("admin:users:read")) {
    return (
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You don't have permission to view user management.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersIcon className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-heading cyber-text-glow">Users Management</h2>
        </div>
        
        {hasPermission("admin:users:write") && (
          <Button className="bg-primary/80 hover:bg-primary">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        )}
      </div>
      
      <Card className="cyber-card border-primary/20">
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_USERS.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {hasPermission("admin:users:write") && (
                        <Button variant="outline" size="sm" onClick={() => toast({ title: "Edit user", description: "Not implemented yet" })}>
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      )}
                      {hasPermission("admin:users:delete") && (
                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                          <UserX className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
