
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/core/card';
import { Button } from '@/ui/core/button';
import { Divider } from '@/ui/core/divider';
import { Footer } from '@/ui/core/Footer';
import { GoogleLoginButton } from '@/ui/auth/GoogleLoginButton';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-md border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">Log in to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <GoogleLoginButton />
              
              <div className="flex items-center gap-2">
                <Divider className="flex-1" />
                <span className="text-xs text-muted-foreground">OR</span>
                <Divider className="flex-1" />
              </div>
              
              <Button variant="outline" className="w-full" asChild>
                <Link to="/auth/email">Continue with Email</Link>
              </Button>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
