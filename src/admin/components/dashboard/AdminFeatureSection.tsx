
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, FileText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminFeatureSectionProps {
  className?: string;
}

export function AdminFeatureSection({ className }: AdminFeatureSectionProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      <Card>
        <CardHeader>
          <Zap className="h-5 w-5 text-primary mb-2" />
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used admin tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Create New Content
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="border-b pb-2">
              <div className="font-medium">User Registration</div>
              <div className="text-muted-foreground">johndoe@example.com</div>
              <div className="text-xs text-muted-foreground">10 minutes ago</div>
            </div>
            <div className="border-b pb-2">
              <div className="font-medium">New Build Submitted</div>
              <div className="text-muted-foreground">Ultimate Voron V2.4</div>
              <div className="text-xs text-muted-foreground">1 hour ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
          <CardDescription>Admin system guides</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <a href="#" className="block text-primary hover:underline">Admin Dashboard Guide</a>
            <a href="#" className="block text-primary hover:underline">Content Management</a>
            <a href="#" className="block text-primary hover:underline">User Management</a>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="w-full">View All Guides</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
