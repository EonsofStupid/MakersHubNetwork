
import React from 'react';
import { Theme } from '@/types/theme';

interface ThemeInfoTabProps {
  theme: Theme;
}

const ThemeInfoTab: React.FC<ThemeInfoTabProps> = ({ theme }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">Name</h3>
        <p className="text-sm">{theme.name || theme.label}</p>
      </div>
      
      {theme.description && (
        <div>
          <h3 className="font-medium">Description</h3>
          <p className="text-sm">{theme.description}</p>
        </div>
      )}
      
      <div>
        <h3 className="font-medium">Status</h3>
        <p className="text-sm capitalize">{theme.status?.toLowerCase()}</p>
      </div>
      
      <div>
        <h3 className="font-medium">Context</h3>
        <p className="text-sm capitalize">{theme.context?.toLowerCase()}</p>
      </div>
      
      <div>
        <h3 className="font-medium">Dark Mode</h3>
        <p className="text-sm">{theme.isDark ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default ThemeInfoTab;
