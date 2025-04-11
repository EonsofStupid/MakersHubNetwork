
import React from "react";
import { Card } from '@/ui/core/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/core/tabs';
import { Package, CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from '@/ui/core/badge';

export default function BuildsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Package className="text-primary w-5 h-5" />
        <h1 className="text-2xl font-bold">Builds Management</h1>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Builds</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">All Builds</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>15 Pending</span>
                </Badge>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  <span>248 Approved</span>
                </Badge>
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                  <XCircle className="w-3 h-3 mr-1" />
                  <span>42 Rejected</span>
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-start space-x-4 border-b border-border pb-4">
                  <div className="rounded-lg bg-primary/10 w-14 h-14 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Custom Ender 3 Build</h3>
                      <Badge variant={item % 3 === 0 ? "destructive" : item % 2 === 0 ? "secondary" : "default"}>
                        {item % 3 === 0 ? "Rejected" : item % 2 === 0 ? "Pending" : "Approved"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Submitted by User{item}</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Pending Approval</h2>
            <p className="text-muted-foreground mb-4">Builds awaiting review and approval.</p>
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="flex items-start space-x-4 border-b border-border pb-4">
                  <div className="rounded-lg bg-primary/10 w-14 h-14 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Custom Ender 3 Build</h3>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Submitted by User{item}</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="approved">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Approved Builds</h2>
            <p className="text-muted-foreground">Approved builds will be displayed here.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="rejected">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Rejected Builds</h2>
            <p className="text-muted-foreground">Rejected builds will be displayed here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
