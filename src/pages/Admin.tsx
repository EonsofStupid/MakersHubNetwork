import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Database, Import, Settings, Table, Upload, Users } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';

const Admin = () => {
  const [importing, setImporting] = useState(false);
  const [selectedTable, setSelectedTable] = useState<"printer_parts" | "manufacturers" | "printer_part_categories">("printer_parts");
  const { toast } = useToast();

  // Fetch stats for overview cards
  const { data: userCount } = useQuery({
    queryKey: ['admin', 'userCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: partsCount } = useQuery({
    queryKey: ['admin', 'partsCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('printer_parts')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: reviewsCount } = useQuery({
    queryKey: ['admin', 'reviewsCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('part_reviews')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedTable) return;

    setImporting(true);
    try {
      const content = await file.text();
      let data = JSON.parse(content);

      const { error } = await supabase
        .from(selectedTable)
        .insert(data);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Data imported successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to import data',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your application settings and data</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-5 gap-4 bg-background p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10">
            <Database className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-primary/10">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-primary/10">
            <Table className="w-4 h-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="import" className="data-[state=active]:bg-primary/10">
            <Import className="w-4 h-4 mr-2" />
            Import
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-primary/10">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
                <CardDescription>Active users in the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{userCount ?? '...'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Printer Parts</CardTitle>
                <CardDescription>Total printer components</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{partsCount ?? '...'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>User submitted reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{reviewsCount ?? '...'}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import Data</CardTitle>
              <CardDescription>Import data from JSON files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedTable} onValueChange={(value: typeof selectedTable) => setSelectedTable(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="printer_parts">Printer Parts</SelectItem>
                  <SelectItem value="manufacturers">Manufacturers</SelectItem>
                  <SelectItem value="printer_part_categories">Categories</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  disabled={importing || !selectedTable}
                />
                <Button disabled={importing}>
                  <Upload className="w-4 h-4 mr-2" />
                  {importing ? 'Importing...' : 'Import'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Manage platform content and moderation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Content management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure global platform settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings configuration coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;