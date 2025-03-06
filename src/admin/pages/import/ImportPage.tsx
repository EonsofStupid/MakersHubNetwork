
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleCyberText } from "@/components/theme/SimpleCyberText";
import { Upload } from "lucide-react";

const ImportPage = () => {
  return (
    <div className="space-y-6">
      <Card className="cyber-card border-primary/20 p-6">
        <div className="flex items-center space-x-2">
          <Upload className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-heading">
            <SimpleCyberText text="Data Import" />
          </h2>
        </div>
        <p className="text-muted-foreground mt-2">Import data from external sources</p>
      </Card>
      
      <Card className="cyber-card border-primary/20">
        <CardHeader>
          <CardTitle>Import Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Data import functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportPage;
