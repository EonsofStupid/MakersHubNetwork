
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { OverviewTab } from "@/components/admin/tabs/OverviewTab";
import { UsersTab } from "@/components/admin/tabs/UsersTab";
import { ImportTab } from "@/components/admin/tabs/ImportTab";
import { SettingsTab } from "@/components/admin/tabs/SettingsTab";
import { DataMaestroTab } from "@/components/admin/tabs/DataMaestroTab";
import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";

const ContentTab = lazy(() => import("@/components/admin/tabs/ContentTab"));
const ChatTab = lazy(() => import("@/components/admin/tabs/ChatTab"));

export default function Admin() {
  const { isAdmin, roles, status } = useAuthStore(state => ({
    isAdmin: state.isAdmin,
    roles: state.roles,
    status: state.status
  }));
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and has admin access
    if (status === "authenticated" && !isAdmin) {
      navigate("/");
    }
    // If user is not authenticated, redirect to login
    else if (status === "unauthenticated") {
      navigate("/login");
    }
  }, [status, isAdmin, navigate]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Checking admin access...</p>
    </div>;
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-heading cyber-text-glow">Admin Panel</h1>
      
      <Tabs defaultValue="overview" className="space-y-6">
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
    </div>
  );
}
