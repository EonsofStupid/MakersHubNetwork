
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBuildAdminStore } from "@/admin/store/buildAdmin.store";
import { formatDistance } from "date-fns";
import { Eye, AlertCircle, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { BuildStatus } from "@/admin/types/build.types";

export function BuildsDataTable() {
  const navigate = useNavigate();
  const { builds, isLoading, error, fetchBuilds } = useBuildAdminStore();
  
  useEffect(() => {
    fetchBuilds();
  }, [fetchBuilds]);
  
  if (isLoading && builds.length === 0) {
    return (
      <Card className="p-8 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="p-6 border-destructive/20">
        <div className="flex items-center text-destructive mb-2">
          <AlertCircle className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Error Loading Builds</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={() => fetchBuilds()}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </Card>
    );
  }
  
  if (builds.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="font-medium text-lg mb-2">No builds found</h3>
        <p className="text-muted-foreground mb-4">There are no builds matching your filters.</p>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden border border-border/40">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Build Title</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Complexity</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {builds.map((build) => (
              <TableRow key={build.id} className="hover:bg-muted/40 transition-colors">
                <TableCell className="font-medium">
                  {build.title}
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span>{build.parts_count} parts</span>
                    <span className="mx-2">•</span>
                    <span>{build.mods_count} mods</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {build.avatar_url ? (
                      <img 
                        src={build.avatar_url} 
                        alt={build.display_name || "User"} 
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs">
                        {(build.display_name || "U")[0]}
                      </div>
                    )}
                    <span>{build.display_name || "Unknown User"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <BuildStatusBadge status={build.status} />
                </TableCell>
                <TableCell>
                  <ComplexityIndicator score={build.complexity_score} />
                </TableCell>
                <TableCell>
                  {build.created_at ? (
                    <span title={new Date(build.created_at).toLocaleString()}>
                      {formatDistance(new Date(build.created_at), new Date(), { addSuffix: true })}
                    </span>
                  ) : (
                    "Unknown"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/admin/builds/${build.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

// Status badge component
function BuildStatusBadge({ status }: { status: BuildStatus }) {
  const getStatusDetails = (status: BuildStatus) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending Review', variant: 'outline', icon: <AlertCircle className="w-3 h-3 mr-1" /> };
      case 'approved':
        return { label: 'Approved', variant: 'default', icon: <CheckCircle className="w-3 h-3 mr-1" /> };
      case 'rejected':
        return { label: 'Rejected', variant: 'destructive', icon: <XCircle className="w-3 h-3 mr-1" /> };
      case 'needs_revision':
        return { label: 'Needs Revision', variant: 'warning', icon: <RotateCcw className="w-3 h-3 mr-1" /> };
      default:
        return { label: status, variant: 'outline', icon: null };
    }
  };
  
  const { label, variant, icon } = getStatusDetails(status);
  
  return (
    <Badge variant={variant as any} className="capitalize flex items-center w-fit">
      {icon}
      {label}
    </Badge>
  );
}

// Complexity indicator component
function ComplexityIndicator({ score }: { score: number }) {
  // Determine complexity level
  let level: 'low' | 'medium' | 'high';
  if (score < 3) level = 'low';
  else if (score < 7) level = 'medium';
  else level = 'high';
  
  // Define colors based on level
  const colors = {
    low: 'bg-green-500',
    medium: 'bg-amber-500',
    high: 'bg-rose-500'
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3].map((_, i) => (
          <div 
            key={i} 
            className={`w-2 h-4 rounded-sm ${i < (score / 3) ? colors[level] : 'bg-muted'}`}
          />
        ))}
      </div>
      <span>{score.toFixed(1)}</span>
    </div>
  );
}
