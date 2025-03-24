
import React from "react";
import { motion } from "framer-motion";
import { CyberCard } from "@/admin/components/ui/CyberCard";
import { 
  Users, Activity, BarChart3, LineChart, 
  Cpu, Zap, Clock, GaugeCircle 
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: number;
  delay?: number;
}

const StatsCard = ({ title, value, icon: Icon, trend = 0, delay = 0 }: StatsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1, duration: 0.5 }}
  >
    <CyberCard interactive className="h-32">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--impulse-text-secondary)]">{title}</h3>
        <Icon className="w-5 h-5 text-[var(--impulse-text-accent)]" />
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold text-[var(--impulse-text-primary)]">{value}</p>
        {trend !== 0 && (
          <div className="flex items-center mt-1">
            <span 
              className={
                trend > 0 
                  ? "text-emerald-400" 
                  : "text-red-400"
              }
            >
              {trend > 0 ? '+' : ''}{trend}%
            </span>
            <span className="text-xs ml-1 text-[var(--impulse-text-secondary)]">vs last month</span>
          </div>
        )}
      </div>
    </CyberCard>
  </motion.div>
);

export default function OverviewDashboard() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="text-2xl font-bold text-[var(--impulse-text-primary)]">
          Admin Dashboard
        </h1>
        <div className="text-sm text-[var(--impulse-text-secondary)]">
          Last updated: {new Date().toLocaleString()}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Users" 
          value="1,234"
          icon={Users}
          trend={12.5}
          delay={0}
        />
        <StatsCard 
          title="Active Now" 
          value="56"
          icon={Activity}
          trend={-3.2}
          delay={1}
        />
        <StatsCard 
          title="Builds This Week" 
          value="87"
          icon={BarChart3}
          trend={24.8}
          delay={2}
        />
        <StatsCard 
          title="Community Score" 
          value="94.2"
          icon={LineChart}
          trend={5.1}
          delay={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <CyberCard title="Performance Metrics" className="h-[300px]">
            <div className="h-[240px] flex items-center justify-center text-[var(--impulse-text-secondary)]">
              Graph coming soon
            </div>
          </CyberCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <CyberCard title="System Status" glow className="h-[300px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[var(--impulse-text-accent)]" />
                  <span className="text-[var(--impulse-text-secondary)]">CPU Usage</span>
                </div>
                <span className="text-[var(--impulse-text-primary)]">28%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[var(--impulse-text-accent)]" />
                  <span className="text-[var(--impulse-text-secondary)]">Memory</span>
                </div>
                <span className="text-[var(--impulse-text-primary)]">1.2 GB</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--impulse-text-accent)]" />
                  <span className="text-[var(--impulse-text-secondary)]">Uptime</span>
                </div>
                <span className="text-[var(--impulse-text-primary)]">99.8%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GaugeCircle className="w-4 h-4 text-[var(--impulse-text-accent)]" />
                  <span className="text-[var(--impulse-text-secondary)]">Response Time</span>
                </div>
                <span className="text-[var(--impulse-text-primary)]">126ms</span>
              </div>
            </div>
          </CyberCard>
        </motion.div>
      </div>
    </div>
  );
}
