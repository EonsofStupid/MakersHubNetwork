import { RevisionScheduling } from "@/components/content/version-control/components/RevisionScheduling";
import { QueueProcessor } from "@/components/content/version-control/components/scheduling/QueueProcessor";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const SchedulePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8 mt-[3.7rem]"
    >
      <h1 className="text-2xl font-bold text-white mb-6">Content Publication Schedule</h1>
      
      <div className="grid gap-6">
        <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Schedule New Publication</h2>
          <RevisionScheduling contentId="" revisionId="" />
        </Card>

        <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Publishing Queue</h2>
          <QueueProcessor />
        </Card>
      </div>
    </motion.div>
  );
};

export default SchedulePage;