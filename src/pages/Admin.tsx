
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AdminLayout } from "@/admin/components/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { OverviewTab } from "@/admin/tabs/OverviewTab";
import { UsersTab } from "@/admin/tabs/UsersTab";
import { ImportTab } from "@/admin/tabs/ImportTab";
import { SettingsTab } from "@/admin/tabs/SettingsTab";
import { DataMaestroTab } from "@/admin/tabs/DataMaestroTab";
import { ChatTab } from "@/admin/tabs/ChatTab";
import { lazy, Suspense } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { useAdminPermissions } from "@/admin/hooks/useAdminPermissions";

// Lazy load content tab for better performance
const ContentTab = lazy(() => import("@/admin/tabs/ContentTab"));

export default function Admin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { status } = useAuthStore();
  const { hasAccess, isLoading } = useAdminPermissions("admin:access");
  
  // Get current tab from URL or default to overview
  const currentTab = searchParams.get('tab') || 'overview';

  // Handle tab change
  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', value);
    setSearchParams(newParams);
  };

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (status === "unauthenticated") {
      navigate("/login");
    }
    // If user doesn't have admin access and authentication check is complete
    else if (!isLoading && !hasAccess && status === "authenticated") {
      navigate("/");
    }
  }, [status, hasAccess, isLoading, navigate]);

  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 text-center">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // The redirect in useEffect will handle unauthorized access
  if (!hasAccess) return null;

  return (
    <AdminLayout title="Admin Dashboard">
      <Tabs defaultValue={currentTab} value={currentTab} onValueChange={handleTabChange} className="space-y-6">
        <Card className="cyber-card border-primary/20">
          <TabsList className="w-full justify-start border-b border-primary/20 rounded-none px-4">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="content"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Content
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="chat"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Chat
            </TabsTrigger>
            <TabsTrigger 
              value="data-maestro"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Data Maestro
            </TabsTrigger>
            <TabsTrigger 
              value="import"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Import
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Settings
            </TabsTrigger>
          </TabsList>
        </Card>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>
        
        <TabsContent value="content">
          <Suspense fallback={<div className="min-h-[600px] flex items-center justify-center">Loading content management...</div>}>
            <ContentTab />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        
        <TabsContent value="chat">
          <Suspense fallback={<div className="min-h-[600px] flex items-center justify-center">Loading chat management...</div>}>
            <ChatTab />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="data-maestro">
          <DataMaestroTab />
        </TabsContent>
        
        <TabsContent value="import">
          <ImportTab />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
