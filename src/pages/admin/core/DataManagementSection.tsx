import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Database, Table, FileSpreadsheet, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DataManagementSection = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Data Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className="p-4 hover:bg-accent transition-colors cursor-pointer" 
          onClick={() => navigate("/admin/visual-builder/single")}
        >
          <div className="flex items-center gap-3">
            <Table className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Single Entry Builder</h3>
              <p className="text-sm text-muted-foreground">Create and manage individual data entries visually</p>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </div>
        </Card>
        
        <Card 
          className="p-4 hover:bg-accent transition-colors cursor-pointer" 
          onClick={() => navigate("/admin/visual-builder/csv")}
        >
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">CSV Import Builder</h3>
              <p className="text-sm text-muted-foreground">Import and manage data from CSV files</p>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </div>
        </Card>

        <Card 
          className="p-4 hover:bg-accent transition-colors cursor-pointer" 
          onClick={() => navigate("/admin/import")}
        >
          <div className="flex items-center gap-3">
            <Upload className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Import Data</h3>
              <p className="text-sm text-muted-foreground">Import data from various sources</p>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </div>
        </Card>

        <Card 
          className="p-4 hover:bg-accent transition-colors cursor-pointer" 
          onClick={() => navigate("/admin/visual-builder")}
        >
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Visual Data Builder</h3>
              <p className="text-sm text-muted-foreground">Build and manage data structures visually</p>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </div>
        </Card>
      </div>
    </Card>
  );
};