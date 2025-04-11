
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function Content() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="text-primary w-5 h-5" />
        <h1 className="text-2xl font-bold">Content Management</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Platform Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Manage and organize your platform's content
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-muted/50">
              <div className="text-2xl font-bold">18</div>
              <div className="text-sm text-muted-foreground">Articles</div>
            </Card>
            
            <Card className="p-4 bg-muted/50">
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
