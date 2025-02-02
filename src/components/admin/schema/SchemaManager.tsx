import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SchemaManager = () => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Schema Management</h3>
        <Button variant="outline">Update Schema</Button>
      </div>
      <div className="space-y-4">
        Schema management interface will be implemented here
      </div>
    </Card>
  );
};

export default SchemaManager;