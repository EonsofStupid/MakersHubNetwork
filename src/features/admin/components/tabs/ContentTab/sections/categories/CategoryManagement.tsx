
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentCategory: string | null;
  createdAt: string;
};

const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'parentCategory',
    header: 'Parent Category',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleDateString();
    },
  },
];

const mockData: Category[] = [
  {
    id: '1',
    name: '3D Printer Parts',
    slug: '3d-printer-parts',
    description: 'Components and parts for 3D printers',
    parentCategory: null,
    createdAt: '2024-02-19T12:00:00Z',
  },
  {
    id: '2',
    name: 'Hot Ends',
    slug: 'hot-ends',
    description: 'Printer hot end assemblies',
    parentCategory: '3D Printer Parts',
    createdAt: '2024-02-18T15:30:00Z',
  },
];

export const CategoryManagement = () => {
  const [categories] = useState<Category[]>(mockData);

  return (
    <Card className="cyber-card backdrop-blur-sm bg-background/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Category Management
            </CardTitle>
            <CardDescription>
              Manage content categories and organization
            </CardDescription>
          </div>
          <Button className="relative group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur" />
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={categories}
          emptyMessage="No categories found"
        />
      </CardContent>
    </Card>
  );
};
