
import { useContentItems } from '@/admin/queries/useContentItems';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ContentType, ContentItem, ContentFilter } from '@/admin/types/content';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { useDeleteContent } from '@/admin/queries/useContentItems';
import { toast } from '@/hooks/use-toast';

interface ContentListProps {
  filter: ContentFilter;
  contentTypes: ContentType[];
}

export const ContentList = ({ filter, contentTypes }: ContentListProps) => {
  const { data: items = [], isLoading } = useContentItems({ filter });
  const { mutate: deleteContent } = useDeleteContent();

  const getContentTypeName = (typeId: string) => {
    const contentType = contentTypes.find(t => t.id === typeId);
    return contentType?.name || 'Unknown Type';
  };

  const handleEdit = (item: ContentItem) => {
    console.log('Edit item:', item);
    // TODO: Implement edit functionality
  };

  const handleDelete = (item: ContentItem) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      deleteContent(item.id, {
        onSuccess: () => {
          toast({
            title: "Content deleted",
            description: "The content has been successfully deleted.",
          });
        },
      });
    }
  };

  const columns: ColumnDef<ContentItem>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => getContentTypeName(row.getValue('type')),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue('status')}</span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => format(new Date(row.getValue('created_at')), 'PPP'),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={items}
      isLoading={isLoading}
      emptyMessage="No content items found"
    />
  );
};
