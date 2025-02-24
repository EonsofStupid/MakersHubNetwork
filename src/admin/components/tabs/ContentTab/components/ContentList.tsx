
import { useContentItems } from '../../../../queries/useContentItems';
import { DataTable } from '@/components/ui/data-table';
import { ContentType, ContentItem } from '../../../../types/content';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ContentFilter } from '../../../../types/content';

interface ContentListProps {
  filter: ContentFilter;
  contentTypes: ContentType[];
}

export const ContentList = ({ filter, contentTypes }: ContentListProps) => {
  const { data: items = [], isLoading } = useContentItems({ filter });

  const getContentTypeName = (typeId: string) => {
    const contentType = contentTypes.find(t => t.id === typeId);
    return contentType?.name || 'Unknown Type';
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
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => format(new Date(row.getValue('created_at')), 'PPP'),
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
