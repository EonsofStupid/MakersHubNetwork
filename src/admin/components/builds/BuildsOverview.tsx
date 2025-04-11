
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/core/card';
import { Alert, AlertDescription, AlertTitle } from '@/ui/core/alert';
import { useBuildAdminStore } from "@/admin/store/buildAdmin.store";
import { BuildsFilters } from "./BuildsFilters";
import { BuildsDataTable } from "./BuildsDataTable";
import { BuildsPagination } from "./BuildsPagination";
import { Package, AlertTriangle } from "lucide-react";

export function BuildsOverview() {
  const { error } = useBuildAdminStore();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Builds Management</h1>
          <p className="text-muted-foreground">
            Review and approve user-submitted 3D printer builds
          </p>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="w-5 h-5" />
            Builds Queue
          </CardTitle>
          <CardDescription>
            Review and manage user-submitted builds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BuildsFilters />
          <BuildsDataTable />
          <BuildsPagination />
        </CardContent>
      </Card>
    </div>
  );
}
