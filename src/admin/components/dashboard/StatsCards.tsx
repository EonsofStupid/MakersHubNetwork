
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  className?: string;
}

export function StatsCards({ className }: StatsCardsProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Platform Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-blue-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Total Users</p>
              <p className="text-sm text-muted-foreground">1,234</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Package className="mr-2 h-4 w-4 text-green-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Published Builds</p>
              <p className="text-sm text-muted-foreground">432</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Star className="mr-2 h-4 w-4 text-amber-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Average Rating</p>
              <p className="text-sm text-muted-foreground">4.7 / 5</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
