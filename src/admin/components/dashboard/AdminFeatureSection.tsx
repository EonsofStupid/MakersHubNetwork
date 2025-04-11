
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/core/card';
import { Badge } from '@/shared/ui/core/badge';
import { FeatureCard } from "./FeatureCard";
import { 
  Package, Users, FileText, Settings, Database, 
  PaintBucket, LayoutDashboard 
} from "lucide-react";

export function AdminFeatureSection() {
  const features = [
    {
      id: "overview",
      title: "Dashboard",
      description: "Platform overview and statistics",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/admin/overview",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    {
      id: "users",
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: <Users className="h-5 w-5" />,
      path: "/admin/users",
      color: "bg-green-500/10 text-green-500 border-green-500/20"
    },
    {
      id: "content",
      title: "Content Manager",
      description: "Edit and publish content across the platform",
      icon: <FileText className="h-5 w-5" />,
      path: "/admin/content",
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    },
    {
      id: "builds",
      title: "Builds",
      description: "Review and manage build submissions",
      icon: <Package className="h-5 w-5" />,
      path: "/admin/builds",
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20"
    },
    {
      id: "data",
      title: "Data Maestro",
      description: "Database management and data tools",
      icon: <Database className="h-5 w-5" />,
      path: "/admin/data-maestro",
      color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
    },
    {
      id: "themes",
      title: "Themes",
      description: "Customize platform appearance",
      icon: <PaintBucket className="h-5 w-5" />,
      path: "/admin/themes",
      color: "bg-pink-500/10 text-pink-500 border-pink-500/20"
    },
  ];

  return (
    <Card className="bg-card/80 backdrop-blur-md border border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Admin Features</span>
          <Badge variant="outline" className="font-normal text-xs">Impulse Admin</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map(feature => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              path={feature.path}
              colorClass={feature.color}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
