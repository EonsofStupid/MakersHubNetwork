
import React from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { ImpulseAdminLayout } from "@/admin/components/layout/ImpulseAdminLayout";
import { cn } from "@/lib/utils";

export default function UnauthorizedPage() {
  return (
    <ImpulseAdminLayout title="Access Denied">
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 px-4 text-center"
        )}
      >
        <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
          <Shield className="h-8 w-8 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-[var(--impulse-text-secondary)] max-w-md">
          You don't have permission to access this area of the admin panel.
        </p>

        <div className="mt-8">
          <Link
            to="/admin/overview"
            className="px-4 py-2 rounded-md bg-[var(--impulse-primary)]/10 hover:bg-[var(--impulse-primary)]/20 text-[var(--impulse-primary)] transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </ImpulseAdminLayout>
  );
}
