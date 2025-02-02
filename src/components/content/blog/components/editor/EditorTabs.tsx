import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EditorTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

const EditorTabs: React.FC<EditorTabsProps> = ({ activeTab, onTabChange, children }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full bg-white/5 border-b border-white/10">
        <TabsTrigger 
          value="visual"
          className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
        >
          Visual
        </TabsTrigger>
        <TabsTrigger 
          value="code"
          className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
        >
          Code
        </TabsTrigger>
        <TabsTrigger 
          value="seo"
          className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
        >
          SEO
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default EditorTabs;