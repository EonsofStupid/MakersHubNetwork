
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkflowEditor } from './WorkflowEditor';
import { WorkflowList } from './WorkflowList';
import { useWorkflowEditor } from '../../stores/workflow-editor';

export function WorkflowManagement() {
  const { currentWorkflow, setWorkflow } = useWorkflowEditor();

  return (
    <Card className="cyber-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gradient text-2xl font-heading">
              Workflow Management
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Create and manage content workflows
            </CardDescription>
          </div>
          <Button 
            className="mad-scientist-hover"
            onClick={() => setWorkflow({ name: '', fields: [] })}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentWorkflow ? (
          <WorkflowEditor />
        ) : (
          <WorkflowList />
        )}
      </CardContent>
    </Card>
  );
}
