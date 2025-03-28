import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Printer, Users, Wrench, ChevronRight } from "lucide-react";

export default function Home() {
  const { data: featuredBuilds } = useQuery({
    queryKey: ["featured-builds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("printer_builds")
        .select(`
          id, 
          title, 
          created_at,
          images,
          parts_count,
          mods_count
        `)
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container py-10">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl font-bold mb-6">Welcome to MakersImpulse</h1>
        <p className="text-xl text-muted-foreground mb-8">
          A hub for passionate makers who are building, customizing, and sharing their 3D printer builds.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/builds">Explore Builds</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/builds/submit">Share Your Build</Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <Printer className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Custom Builds</CardTitle>
            <CardDescription>
              Discover unique 3D printer builds from the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Browse through a wide range of custom builds, from beginner-friendly modifications to advanced engineering marvels.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Wrench className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Parts & Mods</CardTitle>
            <CardDescription>
              Find the perfect parts and modifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Explore a comprehensive database of parts, modifications, and upgrades to enhance your 3D printer.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Maker Community</CardTitle>
            <CardDescription>
              Connect with other enthusiasts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Join a community of like-minded makers to share ideas, get help, and collaborate on projects.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Builds Section */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Recent Builds</h2>
          <Button variant="outline" asChild>
            <Link to="/builds" className="flex items-center">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBuilds ? (
            featuredBuilds.map(build => (
              <Card key={build.id} className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  {build.images && build.images.length > 0 ? (
                    <img 
                      src={build.images[0]} 
                      alt={build.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground">No image</p>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{build.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">Parts: {build.parts_count}</Badge>
                    <Badge variant="outline">Mods: {build.mods_count}</Badge>
                  </div>
                </CardHeader>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={`/builds/${build.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            Array(3).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardHeader>
                  <div className="h-6 bg-muted animate-pulse rounded-md mb-2" />
                  <div className="h-4 bg-muted animate-pulse rounded-md w-1/2" />
                </CardHeader>
                <CardFooter>
                  <div className="h-10 bg-muted animate-pulse rounded-md w-full" />
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="flex flex-col md:flex-row items-center justify-between p-8">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">Ready to share your build?</h3>
            <p className="text-muted-foreground">Show off your 3D printer customizations and help the community grow.</p>
          </div>
          <Button size="lg" asChild>
            <Link to="/builds/submit">Submit Your Build</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
