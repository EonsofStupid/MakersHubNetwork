
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Workflow } from "../../types/content.types";

interface WorkflowEditorProps {
  workflow?: Workflow;
  onSave: (data: Partial<Workflow>) => void;
}

export const WorkflowEditor = ({ workflow, onSave }: WorkflowEditorProps) => {
  return (
    <Card className="p-4 space-y-4">
      <Input
        placeholder="Workflow Name"
        defaultValue={workflow?.name}
        className="w-full"
      />
      <Input
        placeholder="Description"
        defaultValue={workflow?.description}
        className="w-full"
      />
      <Button onClick={() => onSave({ name: "New Workflow", description: "Description", steps: [] })} className="w-full">
        Save Workflow
      </Button>
    </Card>
  );
};
