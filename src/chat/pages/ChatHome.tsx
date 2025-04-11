
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, MessageCircle, Bookmark, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/core/card';
import { Button } from '@/ui/core/button';
import { motion } from 'framer-motion';
import { Textarea } from '@/ui/core/textarea';

export function ChatHome() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Chat Dashboard</h1>
        <p className="text-muted-foreground">Start a new conversation or continue an existing one</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" />
              New Chat
            </CardTitle>
            <CardDescription>Start a new conversation</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="What would you like to talk about?"
              className="min-h-[120px] resize-none"
            />
          </CardContent>
          <CardFooter className="justify-end">
            <Button>
              Start Chat <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Recent Chats
              </CardTitle>
              <CardDescription>Continue a previous conversation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-md hover:bg-muted cursor-pointer">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Project planning discussion</p>
                    <p className="text-xs text-muted-foreground">Yesterday at 2:30 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md hover:bg-muted cursor-pointer">
                  <Bookmark className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Feature brainstorming</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to="/chat/history">View All Chats</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
