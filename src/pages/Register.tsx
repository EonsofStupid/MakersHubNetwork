
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Register() {
  return (
    <div className="container py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Registration form will be implemented here.</p>
          <div className="flex justify-between items-center">
            <Link to="/login" className="text-primary hover:underline">
              Already have an account? Log in
            </Link>
            <Button>Sign Up</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
