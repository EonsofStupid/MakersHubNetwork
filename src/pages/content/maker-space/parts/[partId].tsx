import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const PartDetails = () => {
  const { partId } = useParams();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-6">Part Details: {partId}</h1>
      {/* Part details content will go here */}
    </motion.div>
  );
};

export default PartDetails;