
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Settings, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SimpleCyberText } from "@/components/theme/SimpleCyberText";

const ChatManagement = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center space-x-2 bg-gradient-to-r from-primary/20 to-transparent p-4 rounded-lg">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-heading">
          <SimpleCyberText text="Chat Management" />
        </h2>
      </div>
      
      <motion.div variants={itemVariants}>
        <Card className="cyber-card border-primary/20">
          <CardHeader className="border-b border-primary/10 bg-primary/5">
            <CardTitle className="text-gradient flex items-center gap-2">
              <MessageCircle className="h-5 w-5" /> Chat Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="settings" className="w-full">
              <TabsList className="grid grid-cols-3 bg-primary/5 rounded-lg p-1 mb-6">
                <TabsTrigger 
                  value="settings" 
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </TabsTrigger>
                <TabsTrigger 
                  value="channels" 
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <MessageSquare className="h-4 w-4 mr-2" /> Channels
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <Users className="h-4 w-4 mr-2" /> Users
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-primary/20">
                    <div>
                      <h3 className="font-medium">Enable Chat System</h3>
                      <p className="text-sm text-muted-foreground">Allow users to chat with each other</p>
                    </div>
                    <div className="w-12 h-6 rounded-full bg-primary/20 relative">
                      <div className="absolute inset-y-1 right-1 w-4 h-4 bg-primary rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg border border-primary/20">
                    <div>
                      <h3 className="font-medium">Message Moderation</h3>
                      <p className="text-sm text-muted-foreground">Filter inappropriate content</p>
                    </div>
                    <div className="w-12 h-6 rounded-full bg-primary/20 relative">
                      <div className="absolute inset-y-1 right-1 w-4 h-4 bg-primary rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg border border-primary/20">
                    <div>
                      <h3 className="font-medium">File Sharing</h3>
                      <p className="text-sm text-muted-foreground">Allow users to share files in chat</p>
                    </div>
                    <div className="w-12 h-6 rounded-full bg-primary/20 relative">
                      <div className="absolute inset-y-1 left-1 w-4 h-4 bg-muted rounded-full"></div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="channels" className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-primary/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <h3 className="font-medium">General</h3>
                        <p className="text-sm text-muted-foreground">Public channel for everyone</p>
                      </div>
                    </div>
                    <Button variant="ghost" className="text-primary hover:bg-primary/10">
                      Edit
                    </Button>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-primary/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <h3 className="font-medium">Support</h3>
                        <p className="text-sm text-muted-foreground">Help and support channel</p>
                      </div>
                    </div>
                    <Button variant="ghost" className="text-primary hover:bg-primary/10">
                      Edit
                    </Button>
                  </div>
                  
                  <Button className="w-full border-dashed border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 py-6" variant="ghost">
                    + Add New Channel
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="users" className="space-y-4">
                <div className="border border-primary/20 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 p-4 bg-primary/5 font-medium text-sm">
                    <div>User</div>
                    <div>Role</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                  
                  {["Morgan Lee", "Taylor Kim", "Jordan Smith"].map((name, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 p-4 border-t border-primary/10 items-center">
                      <div>{name}</div>
                      <div className="text-sm">
                        {index === 0 ? "Moderator" : "Member"}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${index !== 2 ? "bg-green-500" : "bg-gray-400"}`}></div>
                        <span className="text-sm">{index !== 2 ? "Online" : "Offline"}</span>
                      </div>
                      <div>
                        <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ChatManagement;
