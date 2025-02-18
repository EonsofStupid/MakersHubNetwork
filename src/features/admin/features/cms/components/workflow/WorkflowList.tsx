
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWorkflowEditor } from '../../stores/workflow-editor';
import { useWorkflows } from '../../queries/useWorkflows';

export function WorkflowList() {
  const { workflows, isLoading, error } = useWorkflows();
  const setWorkflow = useWorkflowEditor((state) => state.setWorkflow);

  if (isLoading) {
    return <div>Loading workflows...</div>;
  }

  if (error) {
    return <div>Error loading workflows: {(error as Error).message}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Content Workflows</h2>
        <Button onClick={() => setWorkflow({ name: '', fields: [] })}>
          Create Workflow
        </Button>
      </div>

      <div className="grid gap-4">
        {workflows?.map((workflow) => (
          <Card key={workflow.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{workflow.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {workflow.fields?.length || 0} fields • Version {workflow.version}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setWorkflow(workflow)}
              >
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
