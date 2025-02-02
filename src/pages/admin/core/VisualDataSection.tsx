import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { UnifiedDataImport } from "@/components/admin/data-maestro/import/UnifiedDataImport";

export const VisualDataSection = () => {
  const navigate = useNavigate();
  const [showImportDialog, setShowImportDialog] = useState(false);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Visual Data Builder</h2>
          <p className="text-muted-foreground mt-1">
            Import and manage data with visual tools
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowImportDialog(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/visual-builder/browse")}>
            <Database className="w-4 h-4 mr-2" />
            Browse Data
          </Button>
        </div>
      </div>

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-5xl">
          <UnifiedDataImport />
        </DialogContent>
      </Dialog>
    </Card>
  );
};