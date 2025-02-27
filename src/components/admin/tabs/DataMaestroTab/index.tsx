
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APIKeyManagement } from "@/components/admin/data-maestro/components/api/KeyManagement";
import { BaselineManager } from "@/components/admin/data-maestro/components/baseline/Rules";
import { CSVUpload } from "@/components/admin/data-maestro/components/import/CSVUpload";
import { DatabaseVisualizer } from "@/components/admin/data-maestro/components/database/Visualizer";
import { DataMaestroTabId, DataMaestroTabIds } from "@/admin/types/data-maestro";

export const DataMaestroTab = () => {
  return (
    <Tabs defaultValue={DataMaestroTabIds.CSV_IMPORT} className="space-y-8">
      <TabsList className="grid grid-cols-4 gap-4 p-1 neo-blur rounded-lg backdrop-blur-xl border border-primary/20">
        {[
          { id: DataMaestroTabIds.CSV_IMPORT, label: "Data Import & Mapping" },
          { id: DataMaestroTabIds.VISUALIZER, label: "Database Explorer" },
          { id: DataMaestroTabIds.BASELINE, label: "Data Integrity & Rules" },
          { id: DataMaestroTabIds.API_KEYS, label: "API & Integrations" }
        ].map(({ id, label }) => (
          <TabsTrigger 
            key={id}
            value={id} 
            className="relative group data-[state=active]:glass-morphism"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur transition-opacity duration-300" />
            <span className="relative z-10">{label}</span>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300 bg-gradient-to-r from-primary to-secondary" />
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={DataMaestroTabIds.CSV_IMPORT}>
        <CSVUpload />
      </TabsContent>

      <TabsContent value={DataMaestroTabIds.VISUALIZER}>
        <DatabaseVisualizer />
      </TabsContent>

      <TabsContent value={DataMaestroTabIds.BASELINE}>
        <BaselineManager />
      </TabsContent>

      <TabsContent value={DataMaestroTabIds.API_KEYS}>
        <APIKeyManagement />
      </TabsContent>
    </Tabs>
  );
};
