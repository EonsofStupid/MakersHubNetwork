
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ErrorBoundary } from '@/ui/core/error-boundary';
import { SimpleCyberText } from '@/ui/theme/SimpleCyberText';
import { Button } from '@/ui/core/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/core/card';
import { Footer } from '@/ui/core/Footer';
import { useUser } from '@/auth/hooks/useUser';
import { Divider } from '@/ui/core/divider';
import { ThemeEffectProvider } from '@/ui/theme/info/ThemeEffectProvider';

const HomePage = () => {
  const { user } = useUser();
  
  return (
    <ErrorBoundary>
      <ThemeEffectProvider>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            <section className="py-12 md:py-24 lg:py-32 xl:py-48">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                      <SimpleCyberText text="Welcome to Impulse" glitch />
                    </h1>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      The next-generation platform for creating amazing digital experiences
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <Button asChild className="button-cyber-glow">
                      <Link to={user ? "/dashboard" : "/login"}>
                        {user ? "Go to Dashboard" : "Get Started"} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/about">Learn More</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          
            <section className="py-12 md:py-24 lg:py-32 bg-muted/50">
              <div className="container px-4 md:px-6">
                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
                  <div className="space-y-4">
                    <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                      Core Features
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                      Everything you need to build amazing products
                    </h2>
                    <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                      Our platform provides all the tools you need to create, deploy, and scale your next big idea.
                    </p>
                  </div>
                  <div className="grid gap-6">
                    {features.map((feature) => (
                      <Card key={feature.title}>
                        <CardHeader>
                          <CardTitle>{feature.title}</CardTitle>
                          <CardDescription>{feature.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            
            <section className="py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-3xl space-y-4 text-center">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to get started?</h2>
                  <p className="text-gray-500 md:text-xl dark:text-gray-400">
                    Join thousands of developers building the future with Impulse.
                  </p>
                  <div className="flex justify-center">
                    <Button asChild size="lg">
                      <Link to="/signup">Create Your Account</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </main>
          
          <Footer />
        </div>
      </ThemeEffectProvider>
    </ErrorBoundary>
  );
}

// Sample features data
const features = [
  {
    title: "Intuitive Design",
    description: "Create beautiful interfaces with our easy-to-use design system"
  },
  {
    title: "Powerful API",
    description: "Connect your application with our robust API endpoints"
  },
  {
    title: "Advanced Analytics",
    description: "Gain insights with comprehensive analytics tools"
  },
];

export default HomePage;
