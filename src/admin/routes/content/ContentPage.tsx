
import React from "react";
import { FileText } from "lucide-react";
import { PlaceholderPage } from "@/admin/routes";

export default function ContentPage() {
  return (
    <PlaceholderPage 
      title="Content Management" 
      description="Create and manage content across the platform." 
      icon={<FileText className="h-8 w-8 text-primary" />}
      requiredPermission="content:view"
    />
  );
}
