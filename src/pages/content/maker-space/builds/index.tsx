import { motion } from "framer-motion";

const Builds = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-6">Builds</h1>
      {/* Build content will go here */}
    </motion.div>
  );
};

export default Builds;