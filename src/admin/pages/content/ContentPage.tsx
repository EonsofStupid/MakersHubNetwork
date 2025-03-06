
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryManagement from "@/admin/cms/components/categories/CategoryManagement";
import { SimpleCyberText } from "@/components/theme/SimpleCyberText";

const ContentPage = () => {
  return (
    <div className="space-y-6">
      <Card className="cyber-card border-primary/20 p-6">
        <h2 className="text-2xl font-heading">
          <SimpleCyberText text="Content Management" />
        </h2>
        <p className="text-muted-foreground mt-2">Manage all content types for MakersImpulse</p>
      </Card>
      
      <Tabs defaultValue="categories">
        <Card className="cyber-card border-primary/20 mb-4">
          <CardContent className="pt-6">
            <TabsList>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>
        
        <TabsContent value="categories">
          <CategoryManagement />
        </TabsContent>
        
        <TabsContent value="articles">
          <Card className="cyber-card border-primary/20">
            <CardHeader>
              <CardTitle>Article Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Article management functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pages">
          <Card className="cyber-card border-primary/20">
            <CardHeader>
              <CardTitle>Page Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Page management functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentPage;
