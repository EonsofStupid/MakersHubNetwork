import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminNav } from "@/components/admin/dashboard/AdminNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { WorkflowForm } from "@/components/admin/workflows/WorkflowForm";
import type { WorkflowFormData, WorkflowData, ParsedWorkflowData } from "@/components/content/types/workflow";
import { parseWorkflowSteps, serializeWorkflowSteps } from "@/components/content/types/workflow";

const WorkflowEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewWorkflow = id === "new";

  const [formData, setFormData] = useState<WorkflowFormData>({
    name: "",
    description: "",
    steps: [],
  });

  const { data: workflow, isLoading } = useQuery({
    queryKey: ["workflow", id],
    queryFn: async () => {
      if (isNewWorkflow) return null;

      console.log("Fetching workflow:", id);
      const { data, error } = await supabase
        .from("cms_workflows")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching workflow:", error);
        throw error;
      }

      // Parse the workflow data
      const parsedData: ParsedWorkflowData = {
        ...data,
        steps: parseWorkflowSteps(data.steps),
      };

      return parsedData;
    },
    enabled: !isNewWorkflow,
  });

  useEffect(() => {
    if (workflow) {
      setFormData({
        name: workflow.name,
        description: workflow.description || "",
        steps: workflow.steps,
      });
    }
  }, [workflow]);

  const { mutate: saveWorkflow, isPending } = useMutation({
    mutationFn: async () => {
      const workflowData = {
        name: formData.name,
        description: formData.description,
        steps: serializeWorkflowSteps(formData.steps),
      };

      if (isNewWorkflow) {
        const { data, error } = await supabase
          .from("cms_workflows")
          .insert([workflowData])
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("cms_workflows")
          .update(workflowData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      toast.success(`Workflow ${isNewWorkflow ? "created" : "updated"} successfully`);
      navigate("/admin/content-management/workflows");
    },
    onError: (error) => {
      console.error("Error saving workflow:", error);
      toast.error("Failed to save workflow");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Workflow name is required");
      return;
    }
    saveWorkflow();
  };

  const handleFormChange = (updates: Partial<WorkflowFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  if (!isNewWorkflow && isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] pt-20 p-8">
        <AdminNav />
        <div className="container mx-auto">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20 p-8">
      <AdminNav />
      <div className="container mx-auto">
        <Card className="glass border-white/10 p-6 bg-black/40 backdrop-blur-xl shadow-[0_0_15px_rgba(65,240,219,0.2)] animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-white/60 hover:text-white"
                onClick={() => navigate("/admin/content-management/workflows")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-bold text-white">
                {isNewWorkflow ? "Create New Workflow" : "Edit Workflow"}
              </h1>
            </div>
            <Button
              onClick={handleSubmit}
              className="bg-neon-cyan/20 text-white border border-neon-cyan/50 hover:bg-neon-cyan/30"
              disabled={isPending}
            >
              {isPending ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Workflow
                </>
              )}
            </Button>
          </div>

          <WorkflowForm 
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </div>
  );
};

export default WorkflowEditor;