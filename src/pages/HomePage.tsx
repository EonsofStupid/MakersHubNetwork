
import React from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

const HomePage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Application</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>App Features</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Explore the different features available in this application.</p>
            <Button className="mt-4" variant="outline" asChild>
              <a href="/about">Learn More</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Access the admin dashboard (requires admin permissions).</p>
            <Button className="mt-4" variant="outline" asChild>
              <a href="/admin">Admin Dashboard</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Start a chat session or view your recent conversations.</p>
            <Button className="mt-4" variant="outline" asChild>
              <a href="/chat">Open Chat</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
