
import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="h-16 w-16 text-muted-foreground" />
              <AlertTriangle className="h-8 w-8 text-destructive absolute bottom-0 right-0" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            You don't have permission to access the admin area. If you believe this is an error, please contact your administrator.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate({ to: "/" })}>
            Return to Home
          </Button>
          <Button onClick={() => navigate({ to: ".." })}>
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
