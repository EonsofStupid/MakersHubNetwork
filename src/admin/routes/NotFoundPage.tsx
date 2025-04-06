
import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { validateAdminPath } from "@/admin/utils/adminRoutes";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Search className="h-16 w-16 text-muted-foreground" />
              <AlertCircle className="h-8 w-8 text-destructive absolute bottom-0 right-0" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            The admin page you are looking for doesn't exist or you may not have access to it.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate({ 
              to: validateAdminPath('/admin/dashboard')
            })}
          >
            Admin Dashboard
          </Button>
          <Button onClick={() => navigate({ to: '..' })}>
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
