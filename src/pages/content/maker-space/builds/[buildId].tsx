import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const BuildDetails = () => {
  const { buildId } = useParams();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-6">Build Details: {buildId}</h1>
      {/* Build details content will go here */}
    </motion.div>
  );
};

export default BuildDetails;