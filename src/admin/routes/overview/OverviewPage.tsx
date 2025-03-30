
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersIcon, Package, BarChart, FileText } from "lucide-react";
import { DashboardShortcuts } from "@/admin/components/dashboard/DashboardShortcuts";
import { motion } from "framer-motion";

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <motion.h1 
        className="text-2xl font-bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Admin Dashboard
      </motion.h1>
      
      {/* Dashboard Shortcuts with rich animations */}
      <DashboardShortcuts />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glassmorphism cyber-effect-1"
        >
          <Card className="p-4 bg-black/30 backdrop-blur-xl border-primary/20">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
              <UsersIcon className="h-4 w-4 text-primary/70" />
            </div>
            <p className="text-2xl font-semibold">1,245</p>
            <span className="text-xs text-primary">+12% from last month</span>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glassmorphism cyber-effect-2"
        >
          <Card className="p-4 bg-black/30 backdrop-blur-xl border-primary/20">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Builds</h3>
              <Package className="h-4 w-4 text-primary/70" />
            </div>
            <p className="text-2xl font-semibold">386</p>
            <span className="text-xs text-primary">+7% from last month</span>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glassmorphism cyber-effect-3"
        >
          <Card className="p-4 bg-black/30 backdrop-blur-xl border-primary/20">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Content Pieces</h3>
              <FileText className="h-4 w-4 text-primary/70" />
            </div>
            <p className="text-2xl font-semibold">127</p>
            <span className="text-xs text-primary">+15% from last month</span>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glassmorphism cyber-effect-1"
        >
          <Card className="p-4 bg-black/30 backdrop-blur-xl border-primary/20">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Active Users</h3>
              <BarChart className="h-4 w-4 text-primary/70" />
            </div>
            <p className="text-2xl font-semibold">89</p>
            <span className="text-xs text-primary">+5% from last week</span>
          </Card>
        </motion.div>
      </div>
      
      <Tabs defaultValue="activity" className="glassmorphism p-2 mt-6">
        <TabsList className="bg-black/40 mb-2">
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="builds">Recent Builds</TabsTrigger>
          <TabsTrigger value="content">Recent Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity">
          <Card className="p-6 bg-black/20 backdrop-blur-xl border-primary/10">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <motion.div 
                  key={item} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item * 0.1 }}
                  className="flex items-start space-x-4 border-b border-border/20 pb-4 hover-glow"
                >
                  <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center electric-border">
                    <UsersIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">User registered</p>
                    <p className="text-sm text-muted-foreground">New user joined the platform</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="builds">
          <Card className="p-6 bg-black/20 backdrop-blur-xl border-primary/10">
            <h2 className="text-xl font-semibold mb-4">Recent Builds</h2>
            <p className="text-muted-foreground">Recent builds will be displayed here.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <Card className="p-6 bg-black/20 backdrop-blur-xl border-primary/10">
            <h2 className="text-xl font-semibold mb-4">Recent Content</h2>
            <p className="text-muted-foreground">Recent content will be displayed here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
