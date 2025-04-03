
import React from "react";
import { ThemeList } from "@/admin/components/theme/ThemeList";
import { Shield } from "lucide-react";

export default function ThemesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="text-primary w-5 h-5" />
        <h1 className="text-2xl font-bold">Theme Management</h1>
      </div>
      
      <ThemeList />
    </div>
  );
}
