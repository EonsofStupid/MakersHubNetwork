import React from 'react';
import { Card } from "@/components/ui/card";

interface ImportSettingsProps {
  settings: Record<string, any>;
  onSettingChange: (key: string, value: boolean) => void;
}

const ImportSettingsCard: React.FC<ImportSettingsProps> = ({ settings, onSettingChange }) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Import Settings</h3>
      {/* Settings content will be implemented here */}
    </Card>
  );
};

export default ImportSettingsCard;