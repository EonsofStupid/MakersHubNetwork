import React from 'react';
import { Card } from "@/components/ui/card";

interface DatabaseSettingsProps {
  settings: Record<string, any>;
  onSettingChange: (key: string, value: boolean) => void;
}

const DatabaseSettingsCard: React.FC<DatabaseSettingsProps> = ({ settings, onSettingChange }) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Database Settings</h3>
      {/* Settings content will be implemented here */}
    </Card>
  );
};

export default DatabaseSettingsCard;