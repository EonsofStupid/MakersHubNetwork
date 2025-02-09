
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Database, Import, Settings, Table, Upload, Users, TrendingUp, Star, FileText } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useActiveUsers } from '@/features/admin/queries/useActiveUsers';
import { usePartsCount } from '@/features/admin/queries/usePartsCount';
import { useReviewsCount } from '@/features/admin/queries/useReviewsCount';
import { useTrendingParts } from '@/features/admin/queries/useTrendingParts';
import { useRecentReviews } from '@/features/admin/queries/useRecentReviews';
import type { Database as DatabaseType } from '@/integrations/supabase/types';

type ImportableTables = 'printer_parts' | 'manufacturers' | 'printer_part_categories';

const Admin = () => {
  const [importing, setImporting] = useState(false);
  const [selectedTable, setSelectedTable] = useState<ImportableTables>('printer_parts');
  const { toast } = useToast();

  const { data: activeUsers, isLoading: loadingUsers } = useActiveUsers();
  const { data: partsCount, isLoading: loadingParts } = usePartsCount();
  const { data: reviewsCount, isLoading: loadingReviews } = useReviewsCount();
  const { data: trendingParts, isLoading: loadingTrending } = useTrendingParts();
  const { data: recentReviews, isLoading: loadingRecentReviews } = useRecentReviews();

  // Set up real-time subscription for updates
  useEffect(() => {
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        // Refetch all queries when any relevant table changes
        void activeUsers;
        void partsCount;
        void reviewsCount;
        void trendingParts;
        void recentReviews;
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
                <CardTitle>Active Users</CardTitle>
                <CardDescription>Currently registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-3xl font-bold">
                    {loadingUsers ? '...' : activeUsers?.length || 0}
                  </p>
                  {activeUsers?.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {activeUsers.map((profile) => (
                        <div key={profile.id} className="flex items-center gap-2">
                          {profile.avatar_url && (
                            <img 
                              src={profile.avatar_url} 
                              alt={profile.display_name || 'User'} 
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <span>{profile.display_name}</span>
                          <div className="flex gap-1">
                            {profile.user_roles?.map((role) => (
                              <span 
                                key={role.id} 
                                className="text-xs bg-primary/10 px-2 py-0.5 rounded-full"
                              >
                                {role.role}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Printer Parts</CardTitle>
                <CardDescription>Total printer components</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {loadingParts ? '...' : partsCount}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>User submitted reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {loadingReviews ? '...' : reviewsCount}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending Parts
                </CardTitle>
                <CardDescription>Top rated printer parts</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTrending ? (
                  <p>Loading trending parts...</p>
                ) : (
                  <div className="space-y-4">
                    {trendingParts?.map((part, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{part.name}</span>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{part.community_score?.toFixed(1)}</span>
                          <span className="text-sm text-muted-foreground">
                            ({part.review_count} reviews)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Reviews
                </CardTitle>
                <CardDescription>Latest user feedback</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingRecentReviews ? (
                  <p>Loading recent reviews...</p>
                ) : (
                  <div className="space-y-4">
                    {recentReviews?.map((review, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{review.printer_parts?.name}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
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
              <Select value={selectedTable} onValueChange={(value: ImportableTables) => setSelectedTable(value)}>
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
