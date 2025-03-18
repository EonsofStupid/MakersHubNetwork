
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Routes, Route, Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import CategoryManagement from "@/admin/cms/components/categories/CategoryManagement";

const Content = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine which tab is active based on the path
  const getActiveTab = () => {
    if (currentPath.includes('/categories')) return 'categories';
    if (currentPath.includes('/articles')) return 'articles';
    if (currentPath.includes('/pages')) return 'pages';
    return 'categories'; // Default tab
  };
  
  const activeTab = getActiveTab();
  
  const handleTabChange = (value: string) => {
    navigate(`/admin/content/${value}`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading cyber-text-glow">Content Management</h2>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <Card className="cyber-card border-primary/20 mb-4">
          <CardContent className="pt-6">
            <TabsList>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>
        
        <Routes>
          <Route index element={<Navigate to="categories" replace />} />
          
          <Route path="categories" element={
            <TabsContent value="categories" forceMount>
              <CategoryManagement />
            </TabsContent>
          } />
          
          <Route path="articles" element={
            <TabsContent value="articles" forceMount>
              <Card className="cyber-card border-primary/20">
                <CardHeader>
                  <CardTitle>Article Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Article management functionality will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          } />
          
          <Route path="pages" element={
            <TabsContent value="pages" forceMount>
              <Card className="cyber-card border-primary/20">
                <CardHeader>
                  <CardTitle>Page Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Page management functionality will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          } />
          
          <Route path="*" element={<Navigate to="categories" replace />} />
        </Routes>
      </Tabs>
    </div>
  );
};

export default Content;
