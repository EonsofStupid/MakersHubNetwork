import React from 'react';
import { AdminNav } from "@/components/admin/dashboard/AdminNav";
import { WorkflowTemplateForm } from '@/components/admin/workflows/WorkflowTemplateForm';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const NewWorkflowTemplate = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20 p-8">
      <AdminNav />
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/10">
            <WorkflowTemplateForm />
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default NewWorkflowTemplate;