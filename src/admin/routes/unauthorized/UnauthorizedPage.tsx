
import React from "react";
import { ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ImpulseAdminLayout } from "@/admin/components/layout/ImpulseAdminLayout";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  
  return (
    <ImpulseAdminLayout title="Access Denied">
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto bg-red-500/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
            <ShieldAlert className="text-red-500 h-8 w-8" />
          </div>
          
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this area. Please contact an administrator if you believe this is an error.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin/overview")}
            >
              Back to Dashboard
            </Button>
            <Button 
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </ImpulseAdminLayout>
  );
}
