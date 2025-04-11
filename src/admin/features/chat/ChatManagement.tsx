
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, User, Clock, Search, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ChatManagement() {
  const { toast } = useToast();
  
  const handleNewResponse = () => {
    toast({
      title: "Coming Soon",
      description: "Chat management features are not yet implemented."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Chat Management</h1>
          <p className="text-muted-foreground">
            Manage chat interactions and automated responses
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Chats</CardTitle>
              <CardDescription>
                Currently active user conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search chats..."
                  className="pl-8 mb-4"
                />
              </div>
              
              <div className="space-y-2">
                {[
                  { name: "John Doe", message: "I need help with my printer setup", time: "2m ago", unread: true },
                  { name: "Jane Smith", message: "What filament would you recommend?", time: "15m ago", unread: false },
                  { name: "Sam Wilson", message: "My prints keep failing halfway", time: "1h ago", unread: false }
                ].map((chat, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      index === 0 ? "bg-primary/10" : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${
                        chat.unread ? "bg-primary/20" : ""
                      }`}>
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{chat.name}</span>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {chat.time}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Automated Responses</CardTitle>
              <CardDescription>
                Configure chat automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: "Welcome Message", enabled: true },
                  { name: "Common Questions", enabled: true },
                  { name: "After Hours Support", enabled: false },
                  { name: "Technical Issues", enabled: true }
                ].map((response, index) => (
                  <div key={index} className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-primary" />
                      <span>{response.name}</span>
                    </div>
                    <div>
                      <Badge className={response.enabled 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-gray-500/10 text-gray-500"
                      }>
                        {response.enabled ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={handleNewResponse}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Response
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Conversation with John Doe</CardTitle>
                  <CardDescription>
                    Started 10 minutes ago
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">View Profile</Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                    <p className="text-sm">Hi there! I'm having trouble with my 3D printer. The extruder keeps clogging after a few hours of printing. Any suggestions?</p>
                    <p className="text-xs text-muted-foreground mt-1">10:32 AM</p>
                  </div>
                </div>
                
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg max-w-[80%]">
                    <p className="text-sm">Hello! I'd be happy to help with your clogging issue. This is often caused by either filament quality, temperature settings, or moisture in the filament. Have you tried changing the filament or adjusting the temperature?</p>
                    <p className="text-xs text-muted-foreground mt-1">10:34 AM</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                    <p className="text-sm">I've been using the same filament for a while without issues. I'll try adjusting the temperature though. What range do you recommend for PLA?</p>
                    <p className="text-xs text-muted-foreground mt-1">10:36 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="p-4 border-t mt-auto">
              <div className="flex gap-2">
                <Input placeholder="Type your message..." className="flex-1" />
                <Button onClick={handleNewResponse}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Import Badge component
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
