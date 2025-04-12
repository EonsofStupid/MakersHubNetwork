
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { useNavigate } from "react-router-dom";
import { Package, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import { BuildStatus } from "@/shared/types/shared.types";

interface BuildItem {
  id: string;
  title: string;
  status: BuildStatus;
  submittedBy: string;
  submittedAt: string;
}

export function BuildApprovalWidget() {
  const navigate = useNavigate();
  
  // Mock data - in a real app, this would come from an API call
  const pendingBuilds: BuildItem[] = [
    {
      id: "build-1",
      title: "Voron 2.4 with custom hotend",
      status: BuildStatus.PENDING,
      submittedBy: "maker42",
      submittedAt: "2023-10-15T10:30:00Z"
    },
    {
      id: "build-2",
      title: "Ender 3 V2 linear rail mod",
      status: BuildStatus.PENDING,
      submittedBy: "printmaster",
      submittedAt: "2023-10-14T15:45:00Z"
    },
    {
      id: "build-3",
      title: "Custom CoreXY with carbon frame",
      status: BuildStatus.NEEDS_REVISION,
      submittedBy: "innovator3d",
      submittedAt: "2023-10-13T09:15:00Z"
    }
  ];
  
  const getStatusIcon = (status: BuildStatus) => {
    switch(status) {
      case BuildStatus.PENDING:
        return <Clock className="h-4 w-4 text-amber-500" />;
      case BuildStatus.APPROVED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case BuildStatus.REJECTED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case BuildStatus.NEEDS_REVISION:
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  const getStatusBadge = (status: BuildStatus) => {
    let className = "";
    let label = "";
    
    switch(status) {
      case BuildStatus.PENDING:
        className = "bg-amber-500/10 text-amber-500 border-amber-500/20";
        label = "Pending";
        break;
      case BuildStatus.APPROVED:
        className = "bg-green-500/10 text-green-500 border-green-500/20";
        label = "Approved";
        break;
      case BuildStatus.REJECTED:
        className = "bg-red-500/10 text-red-500 border-red-500/20";
        label = "Rejected";
        break;
      case BuildStatus.NEEDS_REVISION:
        className = "bg-blue-500/10 text-blue-500 border-blue-500/20";
        label = "Needs Revision";
        break;
    }
    
    return (
      <Badge variant="outline" className={className}>
        <span className="flex items-center gap-1">
          {getStatusIcon(status)}
          {label}
        </span>
      </Badge>
    );
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <Card className="bg-card/80 backdrop-blur-md border border-primary/10 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Build Approval Queue
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {pendingBuilds.length} builds pending review
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs"
          onClick={() => navigate("/admin/builds")}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingBuilds.length > 0 ? (
            pendingBuilds.map(build => (
              <div 
                key={build.id}
                className="p-3 rounded-md border border-primary/10 hover:border-primary/30 transition-colors bg-card/50"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm truncate max-w-[200px]">
                    {build.title}
                  </h3>
                  {getStatusBadge(build.status)}
                </div>
                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                  <span>by {build.submittedBy}</span>
                  <span>{formatDate(build.submittedAt)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              No builds waiting for approval
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
