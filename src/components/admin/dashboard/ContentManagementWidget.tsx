
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Edit, Archive, Clock } from "lucide-react";
import { ContentStatus } from "@/admin/types/content";

interface ContentItem {
  id: string;
  title: string;
  status: ContentStatus;
  author: string;
  updatedAt: string;
  type: string;
}

export function ContentManagementWidget() {
  const navigate = useNavigate();
  
  // Mock data - in a real app, this would come from an API call
  const recentContent: ContentItem[] = [
    {
      id: "content-1",
      title: "Guide to Custom Hotends",
      status: "published",
      author: "admin",
      updatedAt: "2023-10-15T14:30:00Z",
      type: "guide"
    },
    {
      id: "content-2",
      title: "Weekly Community Update",
      status: "draft",
      author: "community-manager",
      updatedAt: "2023-10-14T11:20:00Z",
      type: "post"
    },
    {
      id: "content-3",
      title: "Featured Builds October",
      status: "scheduled",
      author: "editor",
      updatedAt: "2023-10-13T09:45:00Z",
      type: "featured"
    }
  ];
  
  const getStatusIcon = (status: ContentStatus) => {
    switch(status) {
      case "published":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "draft":
        return <Edit className="h-4 w-4 text-amber-500" />;
      case "archived":
        return <Archive className="h-4 w-4 text-gray-500" />;
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const getStatusBadge = (status: ContentStatus) => {
    let className = "";
    
    switch(status) {
      case "published":
        className = "bg-green-500/10 text-green-500 border-green-500/20";
        break;
      case "draft":
        className = "bg-amber-500/10 text-amber-500 border-amber-500/20";
        break;
      case "archived":
        className = "bg-gray-500/10 text-gray-500 border-gray-500/20";
        break;
      case "scheduled":
        className = "bg-blue-500/10 text-blue-500 border-blue-500/20";
        break;
    }
    
    return (
      <Badge variant="outline" className={className}>
        <span className="flex items-center gap-1">
          {getStatusIcon(status)}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </Badge>
    );
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <Card className="bg-card/80 backdrop-blur-md border border-primary/10 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Content Management
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Recently updated content
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs"
            onClick={() => navigate("/admin/content/new")}
          >
            <Plus className="h-3 w-3 mr-1" /> New
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs"
            onClick={() => navigate("/admin/content")}
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentContent.length > 0 ? (
            recentContent.map(item => (
              <div 
                key={item.id}
                className="p-3 rounded-md border border-primary/10 hover:border-primary/30 transition-colors bg-card/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-xs">
                      {item.type}
                    </Badge>
                    <h3 className="font-medium text-sm truncate max-w-[180px]">
                      {item.title}
                    </h3>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                  <span>by {item.author}</span>
                  <span>Updated: {formatDate(item.updatedAt)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              No recent content updates
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
