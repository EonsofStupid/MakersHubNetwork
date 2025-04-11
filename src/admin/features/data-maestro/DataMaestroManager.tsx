
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, ArrowDownToLine, ArrowUpFromLine, Plus, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export default function DataMaestroManager() {
  const { toast } = useToast();
  
  const handleAction = (action: string) => {
    toast({
      title: "Coming Soon",
      description: `The ${action} feature is not yet implemented.`
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Data Maestro</h1>
          <p className="text-muted-foreground">
            Import, export, and manage your data connections
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleAction("import data")}>
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" onClick={() => handleAction("export data")}>
            <ArrowUpFromLine className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => handleAction("new connection")}>
            <Plus className="mr-2 h-4 w-4" />
            New Connection
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="connections">
        <TabsList>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="imports">Imports</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
          <TabsTrigger value="migrations">Migrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connections" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {["Database", "API", "File System", "Custom Source"].map((source, index) => (
              <Card key={index} className="hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{source}</CardTitle>
                      <CardDescription>
                        {index % 2 === 0 ? "Active connection" : "Inactive connection"}
                      </CardDescription>
                    </div>
                    <Badge className={
                      index % 2 === 0 
                        ? "bg-green-500/10 text-green-500"
                        : "bg-gray-500/10 text-gray-500"
                    }>
                      {index % 2 === 0 ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last synced:</span>
                        <span>
                          {index % 2 === 0 
                            ? new Date().toLocaleDateString() 
                            : "Never"
                          }
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Records:</span>
                        <span>{index * 1240 + 325}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAction(`refresh ${source} connection`)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Sync
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleAction(`edit ${source} connection`)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="border-dashed hover:border-primary/50 transition-colors duration-300 flex flex-col items-center justify-center p-6 cursor-pointer" onClick={() => handleAction("create connection")}>
              <Database className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="font-medium">Add New Connection</p>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                Connect to another data source for import/export
              </p>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="imports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Imports</CardTitle>
              <CardDescription>
                View and manage your data imports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {["User Data", "Product Catalog", "Price Lists"].map((name, index) => (
                  <div key={index} className="flex flex-col gap-2 p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{name} Import</h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date().toLocaleDateString()} • {index * 1230 + 456} records
                        </p>
                      </div>
                      <Badge className={
                        index % 3 === 0 
                          ? "bg-green-500/10 text-green-500"
                          : index % 3 === 1
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-yellow-500/10 text-yellow-500"
                      }>
                        {index % 3 === 0 
                          ? "Completed" 
                          : index % 3 === 1 
                            ? "Processing" 
                            : "Pending"
                        }
                      </Badge>
                    </div>
                    
                    {index % 3 === 1 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span>68%</span>
                        </div>
                        <Progress value={68} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-2 mt-2">
                      {index % 3 === 0 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAction("download import results")}
                        >
                          Download Results
                        </Button>
                      )}
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleAction("view import details")}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Exports</CardTitle>
              <CardDescription>
                View and manage your data exports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <div className="flex flex-col items-center gap-3">
                  <ArrowUpFromLine className="h-10 w-10 text-muted-foreground" />
                  <h3 className="font-medium">No exports yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    You haven't exported any data yet. Export your data to CSV, JSON, or Excel formats.
                  </p>
                  <Button 
                    className="mt-2"
                    onClick={() => handleAction("create export")}
                  >
                    Create Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
