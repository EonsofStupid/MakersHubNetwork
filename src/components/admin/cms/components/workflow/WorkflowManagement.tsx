
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, GitBranch } from 'lucide-react';
import { WorkflowList } from './WorkflowList';
import { WorkflowEditor } from './WorkflowEditor';

export const WorkflowManagement = () => {
  return (
    <Card className="cyber-card backdrop-blur-sm bg-background/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Content Workflows
            </CardTitle>
            <CardDescription>
              Define and manage content approval workflows
            </CardDescription>
          </div>
          <Button className="relative group hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur" />
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-3 border rounded-md p-4 bg-background/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Available Workflows</h3>
            </div>
            
            <WorkflowList />
          </div>
          
          <div className="lg:col-span-4 border rounded-md p-4 bg-background/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Workflow Editor</h3>
            </div>
            
            <div className="h-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <GitBranch className="w-12 h-12 mb-4 opacity-20" />
              <p>Select a workflow to edit</p>
              <p className="text-sm mt-2">
                Or create a new workflow to define your content process.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
