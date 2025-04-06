
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Welcome to Impulse
        </h1>
        <p className="mt-4 max-w-[42rem] text-muted-foreground">
          Your flexible, powerful administration platform.
        </p>
        
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button asChild>
            <Link to="/admin">
              Admin Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/about">
              Learn More
            </Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Powerful Admin</CardTitle>
              <CardDescription>Comprehensive admin interface with role-based access control</CardDescription>
            </CardHeader>
            <CardContent>
              Manage users, content, and system settings with our flexible admin dashboard.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Visual Editor</CardTitle>
              <CardDescription>Edit your content with a visual interface</CardDescription>
            </CardHeader>
            <CardContent>
              Drag and drop components to build your pages without coding knowledge.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Extensible</CardTitle>
              <CardDescription>Add custom functionality with ease</CardDescription>
            </CardHeader>
            <CardContent>
              Build and integrate your own modules or use our growing library of extensions.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
