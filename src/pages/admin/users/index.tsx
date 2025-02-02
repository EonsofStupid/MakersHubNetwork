import React from "react";
import { AdminNav } from "@/components/admin/dashboard/AdminNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UsersList } from "@/components/admin/users/UsersList";
import { CreateUserForm } from "@/components/admin/users/CreateUserForm";
import { UserBulkActions } from "@/components/admin/users/UserBulkActions";
import { UserMetrics } from "@/components/admin/users/UserMetrics";
import { useUserMetrics } from "@/hooks/useUserMetrics";

const UserManagement = () => {
  const { data: metrics, isLoading: isLoadingMetrics } = useUserMetrics();
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="min-h-screen bg-gray-900 pt-20 p-8">
      <AdminNav />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <div className="w-64 relative">
            <Input
              type="search"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800/50 border-white/10 text-white pl-10"
            />
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        {metrics && <UserMetrics data={metrics} />}

        <div className="mt-8">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="bg-gray-800/50 border-white/10">
              <TabsTrigger value="users" className="data-[state=active]:bg-white/10">
                Users List
              </TabsTrigger>
              <TabsTrigger value="create" className="data-[state=active]:bg-white/10">
                Create User
              </TabsTrigger>
              <TabsTrigger value="bulk" className="data-[state=active]:bg-white/10">
                Bulk Actions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="mt-4">
              <UsersList searchQuery={searchQuery} />
            </TabsContent>
            
            <TabsContent value="create" className="mt-4">
              <CreateUserForm />
            </TabsContent>
            
            <TabsContent value="bulk" className="mt-4">
              <UserBulkActions />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default UserManagement;