
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ApiKeysPanel } from "./sections/ApiKeysPanel";
import { SettingsPanel } from "./sections/SettingsPanel";
import { UsagePanel } from "./sections/UsagePanel";

const ChatTab = () => {
  const [activeTab, setActiveTab] = useState("api-keys");

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative min-h-[600px] rounded-lg"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card className="cyber-card bg-background/50 backdrop-blur-sm border border-primary/20">
            <TabsList className="w-full justify-start border-b border-primary/20 rounded-none px-4">
              <TabsTrigger 
                value="api-keys"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                API Keys
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Settings
              </TabsTrigger>
              <TabsTrigger 
                value="usage"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Usage & Analytics
              </TabsTrigger>
            </TabsList>
          </Card>

          <TabsContent value="api-keys">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <ApiKeysPanel />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <SettingsPanel />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="usage">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <UsagePanel />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ChatTab;
