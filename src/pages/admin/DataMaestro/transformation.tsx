import React from 'react';
import TransformationRuleEditor from "@/components/admin/data-maestro/transformation/TransformationRuleEditor";
import { useToast } from "@/components/ui/use-toast";
import { TransformationRule } from "@/lib/transformations/types";

const TransformationPage = () => {
  const { toast } = useToast();

  const handleSaveRule = async (rule: TransformationRule) => {
    try {
      // Save transformation rule logic here
      toast({
        title: "Success",
        description: "Transformation rule saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save transformation rule",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Transformation Rules</h1>
      <TransformationRuleEditor onSave={handleSaveRule} />
    </div>
  );
};

export default TransformationPage;