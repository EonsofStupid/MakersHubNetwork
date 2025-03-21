
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Shield, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { SimpleCyberText } from "@/components/theme/SimpleCyberText";

const UsersManagement = () => {
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

  // Mock user data
  const mockUsers = [
    { id: 1, name: "Alex Johnson", email: "alex@makers.io", role: "Admin", status: "Active" },
    { id: 2, name: "Morgan Smith", email: "morgan@makers.io", role: "Editor", status: "Active" },
    { id: 3, name: "Jamie Wilson", email: "jamie@makers.io", role: "Viewer", status: "Inactive" },
  ];

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center space-x-2 bg-gradient-to-r from-primary/20 to-transparent p-4 rounded-lg">
        <Users className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-heading">
          <SimpleCyberText text="Users Management" />
        </h2>
      </div>
      
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-8 bg-background/80 border-primary/20 focus-visible:ring-primary/30" 
          />
        </div>
        
        <Button className="bg-primary hover:bg-primary/80 text-primary-foreground">
          <UserPlus className="h-4 w-4 mr-2" /> Add User
        </Button>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="cyber-card border-primary/20">
          <CardHeader className="border-b border-primary/10 bg-primary/5">
            <CardTitle className="text-gradient flex items-center gap-2">
              <Shield className="h-5 w-5" /> User List
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-xs uppercase bg-primary/5 text-primary border-b border-primary/10">
                  <tr>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Role</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                  {mockUsers.map(user => (
                    <tr key={user.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          user.role === 'Admin' 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-secondary/20 text-secondary'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          user.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></span>
                        {user.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default UsersManagement;
