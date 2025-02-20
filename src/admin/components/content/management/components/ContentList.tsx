
import { ContentType, ContentFilter, ContentItem } from '@/admin/types/content';
import { DataTable } from '@/components/ui/data-table';
import { useContentItems } from '@/admin/queries/content/useContentItems';

interface ContentListProps {
  filter: ContentFilter;
  contentTypes: ContentType[];
}

export const ContentList = ({ 
  filter,
  contentTypes 
}: ContentListProps) => {
  const { data: items, isLoading } = useContentItems(filter);

  const columns = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const typeId = row.getValue('type');
        const type = contentTypes.find(t => t.id === typeId);
        return type?.name || typeId;
      }
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
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => {
        return new Date(row.getValue('created_at')).toLocaleDateString();
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={items || []}
      isLoading={isLoading}
      emptyMessage="No content items found"
    />
  );
};
