
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

type Workflow = {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  steps: number;
  createdAt: string;
};

const columns: ColumnDef<Workflow>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <div className="px-2 py-1 rounded text-xs bg-primary/20 text-primary w-fit">
        {row.getValue('status')}
      </div>
    ),
  },
  {
    accessorKey: 'steps',
    header: 'Steps',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleDateString();
    },
  },
];

const mockData: Workflow[] = [
  {
    id: '1',
    name: 'Build Approval',
    description: 'Standard workflow for approving community builds',
    status: 'active',
    steps: 3,
    createdAt: '2024-02-19T12:00:00Z',
  },
  {
    id: '2',
    name: 'Content Review',
    description: 'Review process for user-submitted content',
    status: 'draft',
    steps: 2,
    createdAt: '2024-02-18T15:30:00Z',
  },
];

export const WorkflowManagement = () => {
  const [workflows] = useState<Workflow[]>(mockData);

  return (
    <Card className="cyber-card backdrop-blur-sm bg-background/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Workflow Management
            </CardTitle>
            <CardDescription>
              Configure and manage content workflows
            </CardDescription>
          </div>
          <Button className="relative group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur" />
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={workflows}
          emptyMessage="No workflows found"
        />
      </CardContent>
    </Card>
  );
};
