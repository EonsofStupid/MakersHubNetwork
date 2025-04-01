
import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <ShieldAlert className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        You don't have permission to access the admin section. Please contact an administrator if you believe this is an error.
      </p>
      <Button asChild>
        <Link to="/">Return to Homepage</Link>
      </Button>
    </div>
  );
}
