
import { Button } from "@/ui/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/core/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ThemeEffectProvider } from "@/ui/theme/info/ThemeEffectProvider";
import { useAuth } from "@/auth/hooks/useAuth";

export default function Index() {
  const { user } = useAuth();
  
  return (
    <ThemeEffectProvider>
      <div className="container px-4 py-12 md:py-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to Your App
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            A modern application built with React, Tailwind CSS, and shadcn/ui.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to={user ? "/dashboard" : "/auth/register"}>
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/resources/docs">
                Documentation
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Feature 1</CardTitle>
              <CardDescription>
                Description of the first feature
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>More detailed information about Feature 1.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Feature 2</CardTitle>
              <CardDescription>
                Description of the second feature
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>More detailed information about Feature 2.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Feature 3</CardTitle>
              <CardDescription>
                Description of the third feature
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>More detailed information about Feature 3.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThemeEffectProvider>
  );
}
