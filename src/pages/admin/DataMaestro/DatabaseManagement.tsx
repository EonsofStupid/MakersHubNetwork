import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Database, Table, ArrowRight, ServerCog } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ERDVisualizer from "@/components/admin/schema/ERDVisualizer";
import SchemaManager from "@/components/admin/schema/SchemaManager";
import { useToast } from "@/components/ui/use-toast";

const DatabaseManagement = () => {
  const { toast } = useToast();
  
  const { data: tables } = useQuery({
    queryKey: ["database-tables"],
    queryFn: async () => {
      const { data: result } = await supabase
        .from('cms_content')
        .select('id');
      return result || [];
    }
  });

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          Database Management
        </h1>
        <p className="text-muted-foreground">
          Visualize and manage your database structure
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 h-full hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Schema Overview</h3>
              <p className="text-muted-foreground">
                View and manage your database schema structure
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {tables?.length || 0} Tables
                </span>
                <Button variant="ghost" size="sm" className="group">
                  View Schema
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 h-full hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <Table className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Table Management</h3>
              <p className="text-muted-foreground">
                Create, modify, and manage database tables
              </p>
              <Button variant="ghost" size="sm" className="group">
                Manage Tables
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 h-full hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <ServerCog className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Database Settings</h3>
              <p className="text-muted-foreground">
                Configure database settings and optimizations
              </p>
              <Button variant="ghost" size="sm" className="group">
                Configure
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Entity Relationship Diagram</h3>
          <ERDVisualizer />
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Schema Management</h3>
          <SchemaManager />
        </Card>
      </motion.div>
    </div>
  );
};

export default DatabaseManagement;
