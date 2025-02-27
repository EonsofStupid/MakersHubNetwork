
import { Card } from "@/components/ui/card";
import { Workflow } from "../../types/content.types";

interface WorkflowListProps {
  workflows: Workflow[];
  onSelect: (workflow: Workflow) => void;
}

export const WorkflowList = ({ workflows, onSelect }: WorkflowListProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {workflows.map((workflow) => (
        <Card
          key={workflow.id}
          className="p-4 cursor-pointer hover:border-primary/40 transition-all duration-300"
          onClick={() => onSelect(workflow)}
        >
          <h3 className="font-medium">{workflow.name}</h3>
          <p className="text-sm text-muted-foreground">{workflow.description}</p>
        </Card>
      ))}
    </div>
  );
};
