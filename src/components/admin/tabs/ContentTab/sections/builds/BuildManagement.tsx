
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

type Build = {
  id: string;
  title: string;
  submittedBy: string;
  status: string;
  submittedAt: string;
};

const columns: ColumnDef<Build>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'submittedBy',
    header: 'Submitted By',
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
    accessorKey: 'submittedAt',
    header: 'Submitted At',
    cell: ({ row }) => {
      return new Date(row.getValue('submittedAt')).toLocaleDateString();
    },
  },
];

const mockData: Build[] = [
  {
    id: '1',
    title: 'Ender 3 Pro Custom Build',
    submittedBy: 'maker123',
    status: 'pending',
    submittedAt: '2024-02-19T12:00:00Z',
  },
  {
    id: '2',
    title: 'Voron 2.4 Build Guide',
    submittedBy: 'voronUser',
    status: 'approved',
    submittedAt: '2024-02-18T15:30:00Z',
  },
];

export const BuildManagement = () => {
  const [builds] = useState<Build[]>(mockData);

  return (
    <Card className="cyber-card backdrop-blur-sm bg-background/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Build Management
            </CardTitle>
            <CardDescription>
              Manage and review community build submissions
            </CardDescription>
          </div>
          <Button className="relative group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur" />
            <Plus className="w-4 h-4 mr-2" />
            New Build
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={builds}
          emptyMessage="No builds found"
        />
      </CardContent>
    </Card>
  );
};
