
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, FileUp, Database, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { DataMaestroTabId, DataMaestroTabIds } from "@/features/admin/types/data-maestro";
import { APIKeyManagement } from "./components/APIKeyManagement";
import { CSVImport } from "./components/CSVImport";
import { DatabaseVisualizer } from "./components/DatabaseVisualizer";
import { BaselineManager } from "./components/BaselineManager";

const tabs: { id: DataMaestroTabId; label: string; icon: any }[] = [
  { id: DataMaestroTabIds.API_KEYS, label: 'API Keys', icon: Key },
  { id: DataMaestroTabIds.CSV_IMPORT, label: 'Import', icon: FileUp },
  { id: DataMaestroTabIds.VISUALIZER, label: 'Visualizer', icon: Database },
  { id: DataMaestroTabIds.BASELINE, label: 'Baseline', icon: Shield },
];

export const DataMaestroTab = () => {
  return (
    <Card className="p-6 neo-blur">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent">
              Data Maestro
            </h2>
            <p className="text-muted-foreground">
              Manage your data with AI-powered tools
            </p>
          </div>
        </div>

        <Tabs defaultValue={DataMaestroTabIds.API_KEYS} className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-4 p-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="relative group data-[state=active]:glass-morphism"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur transition-opacity duration-300" />
                <Icon className="w-4 h-4 mr-2 group-data-[state=active]:text-primary" />
                <span className="relative z-10">{label}</span>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300 bg-gradient-to-r from-primary to-secondary" />
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={DataMaestroTabIds.API_KEYS}>
            <APIKeyManagement />
          </TabsContent>
          
          <TabsContent value={DataMaestroTabIds.CSV_IMPORT}>
            <CSVImport />
          </TabsContent>
          
          <TabsContent value={DataMaestroTabIds.VISUALIZER}>
            <DatabaseVisualizer />
          </TabsContent>
          
          <TabsContent value={DataMaestroTabIds.BASELINE}>
            <BaselineManager />
          </TabsContent>
        </Tabs>
      </motion.div>
    </Card>
  );
};
