import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const GuideDetails = () => {
  const { guideId } = useParams();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-6">Guide Details: {guideId}</h1>
      {/* Guide details content will go here */}
    </motion.div>
  );
};

export default GuideDetails;