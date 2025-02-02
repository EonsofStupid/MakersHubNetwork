import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TransformationRule } from "@/lib/transformations/types";

interface TransformationRuleEditorProps {
  onSave: (rule: TransformationRule) => Promise<void>;
}

const TransformationRuleEditor = ({ onSave }: TransformationRuleEditorProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Transformation Rules</h3>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <p className="text-muted-foreground">Transformation rules editor will be implemented here</p>
      </motion.div>
    </Card>
  );
};

export default TransformationRuleEditor;