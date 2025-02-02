import React from 'react';
import { Card } from "@/components/ui/card";

interface InterfaceSettingsProps {
  settings: Record<string, any>;
  onSettingChange: (key: string, value: boolean) => void;
}

const InterfaceSettingsCard: React.FC<InterfaceSettingsProps> = ({ settings, onSettingChange }) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Interface Settings</h3>
      {/* Settings content will be implemented here */}
    </Card>
  );
};

export default InterfaceSettingsCard;