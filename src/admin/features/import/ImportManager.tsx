
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ImportManager = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading cyber-text-glow">Data Import</h2>
      
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

export default ImportManager;
