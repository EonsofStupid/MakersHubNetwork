import React from "react";
import { AdminNav } from "@/components/admin/dashboard/AdminNav";
import { ContentTypesList } from "./components/ContentTypesList";
import { RevisionHistoryViewer } from "./components/RevisionHistoryViewer";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const ContentTypesSettings = () => {
  const [selectedContentId, setSelectedContentId] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-900 pt-20 p-8">
      <AdminNav />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Content Types</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 bg-gray-800/50 border border-white/10">
              <ContentTypesList onSelectContent={setSelectedContentId} />
            </Card>
          </div>
          
          <div>
            <Card className="p-6 bg-gray-800/50 border border-white/10 sticky top-24">
              <RevisionHistoryViewer contentId={selectedContentId} />
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContentTypesSettings;