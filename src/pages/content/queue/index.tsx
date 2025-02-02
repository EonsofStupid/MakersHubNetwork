import { QueueProcessor } from "@/components/content/version-control/components/scheduling/QueueProcessor";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const QueuePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8 mt-[3.7rem]"
    >
      <h1 className="text-2xl font-bold text-white mb-6">Publishing Queue</h1>
      
      <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/10">
        <QueueProcessor />
      </Card>
    </motion.div>
  );
};

export default QueuePage;