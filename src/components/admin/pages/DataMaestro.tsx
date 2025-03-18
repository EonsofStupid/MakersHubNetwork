
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Layers, Code, Table, ArrowDownToLine, Filter, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAdminStore } from "@/stores/admin/store";

const DataMaestro = () => {
  const { toast } = useToast();
  const { hasPermission } = useAdminStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Data Refreshed",
        description: "Your data has been refreshed successfully."
      });
    }, 1500);
  };

  if (!hasPermission("admin:access")) {
    return (
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You don't have permission to access data management tools.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-heading cyber-text-glow">Data Maestro</h2>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
          
          {hasPermission("admin:data:export") && (
            <Button>
              <ArrowDownToLine className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="explorer" className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="explorer" className="flex items-center gap-2">
            <Table className="h-4 w-4" /> Data Explorer
          </TabsTrigger>
          <TabsTrigger value="transformations" className="flex items-center gap-2">
            <Layers className="h-4 w-4" /> Transformations
          </TabsTrigger>
          <TabsTrigger value="queries" className="flex items-center gap-2">
            <Code className="h-4 w-4" /> Advanced Queries
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="explorer">
          <Card className="cyber-card border-primary/20">
            <CardHeader>
              <CardTitle>Data Explorer</CardTitle>
              <CardDescription>
                Browse and manage your application data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
                
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">
                    Select a data collection from the list below to start exploring.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Users", "Products", "Categories", "Orders", "Reviews", "Subscriptions"].map((collection) => (
                    <Button 
                      key={collection} 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center hover:bg-primary/10 transition-colors"
                      onClick={() => toast({ description: `${collection} data will be displayed here.` })}
                    >
                      <span className="text-lg font-medium">{collection}</span>
                      <span className="text-xs text-muted-foreground">15 records</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transformations">
          <Card className="cyber-card border-primary/20">
            <CardHeader>
              <CardTitle>Data Transformations</CardTitle>
              <CardDescription>
                Create and manage data transformation pipelines.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Data transformation functionality will be implemented here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="queries">
          <Card className="cyber-card border-primary/20">
            <CardHeader>
              <CardTitle>Advanced Queries</CardTitle>
              <CardDescription>
                Run custom queries against your data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Advanced query functionality will be implemented here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataMaestro;
