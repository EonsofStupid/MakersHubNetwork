import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Database, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ImportData = () => {
  const { toast } = useToast();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
            Import Data
          </h1>
          <p className="text-muted-foreground mt-2">
            Import and transform your data from various sources
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">CSV Import</h3>
            <p className="text-muted-foreground mb-4">
              Import data from CSV files with advanced mapping options
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => toast({ title: "Starting CSV import..." })}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Database Import</h3>
            <p className="text-muted-foreground mb-4">
              Import data directly from other databases
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => toast({ title: "Starting database import..." })}
            >
              <Upload className="w-4 h-4 mr-2" />
              Connect Database
            </Button>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Import Settings</h3>
            <p className="text-muted-foreground mb-4">
              Configure import rules and validation settings
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => toast({ title: "Opening import settings..." })}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ImportData;