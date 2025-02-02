import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface FeaturePanelProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  link: string;
}

export const FeaturePanel = ({ icon: Icon, title, description, gradient, link }: FeaturePanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-xl ${gradient} p-1`}
    >
      <Link 
        to={link}
        className="block h-full"
      >
        <div className="glass p-6 h-full rounded-lg backdrop-blur-xl border border-white/10 hover:border-neon-cyan/30 transition-all duration-300">
          <Icon className="w-12 h-12 mb-4 text-[#41f0db] animate-pulse" />
          <h3 className="text-2xl font-bold text-white mb-2 animate-neon-glow">{title}</h3>
          <p className="text-white/80">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
};