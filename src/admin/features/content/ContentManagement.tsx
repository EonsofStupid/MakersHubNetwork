
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/core/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/core/tabs';
import { Button } from '@/ui/core/button';
import { Input } from '@/ui/core/input';
import { Badge } from '@/ui/core/badge';
import { PlusCircle, FileText, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContentManagement() {
  const { toast } = useToast();
  
  const handleCreateContent = () => {
    toast({
      title: "Coming Soon",
      description: "Content creation feature is not yet implemented"
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">Manage all your content in one place</p>
        </div>
        
        <Button onClick={handleCreateContent}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Content
        </Button>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Content Library</CardTitle>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search content..."
                    className="pl-8 w-[200px] lg:w-[300px]"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Content</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium">Title</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Author</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <tr key={index} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">Example Content {index + 1}</div>
                              <div className="text-xs text-muted-foreground">/example-content-{index + 1}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                            {index % 2 === 0 ? "Post" : "Page"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={
                            index % 3 === 0 
                              ? "bg-green-500/10 text-green-500" 
                              : index % 3 === 1 
                                ? "bg-orange-500/10 text-orange-500"
                                : "bg-gray-500/10 text-gray-500"
                          }>
                            {index % 3 === 0 ? "Published" : index % 3 === 1 ? "Draft" : "Archived"}
                          </Badge>
                        </td>
                        <td className="p-4">Admin User</td>
                        <td className="p-4 text-muted-foreground text-xs">
                          {new Date().toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Empty state */}
            {false && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No content yet</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first content piece
                </p>
                <Button onClick={handleCreateContent}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Content
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
