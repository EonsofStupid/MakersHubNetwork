import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const UsersTab = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>User Role Management</CardTitle>
          <CardDescription>Manage user roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Role management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};
