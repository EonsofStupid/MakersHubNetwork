
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BuildApprovalWidgetProps {
  className?: string;
}

export function BuildApprovalWidget({ className }: BuildApprovalWidgetProps) {
  // This would normally fetch data from an API
  const pendingBuilds = 3;
  
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Builds Pending Approval</CardTitle>
        <Package className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{pendingBuilds}</div>
        <p className="text-xs text-muted-foreground">
          +1 since last week
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            <span className="text-sm">Approved today: 2</span>
          </div>
          <div className="flex items-center">
            <XCircle className="mr-2 h-4 w-4 text-red-500" />
            <span className="text-sm">Rejected today: 1</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
