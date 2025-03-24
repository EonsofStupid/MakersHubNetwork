
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { ContentStatus, ContentFilter } from '../../../../admin/types/content';

// Define ContentType interface properly
interface ContentType {
  id: string;
  name: string;
}

interface ContentFilterProps {
  filter: ContentFilter;
  onFilterChange: (newFilter: ContentFilter) => void;
  contentTypes: ContentType[];
}

export const ContentFilterComponent: React.FC<ContentFilterProps> = ({
  filter,
  onFilterChange,
  contentTypes,
}) => {
  // Type guard to ensure status is either "all" or a valid ContentStatus
  const handleStatusChange = (status: string) => {
    // Define valid status values
    const validStatusValues: Array<ContentStatus | "all"> = ["all", "draft", "published", "archived", "scheduled"];
    
    // Check if the value is valid before assigning
    const validStatus = validStatusValues.includes(status as any) 
      ? (status === 'all' ? undefined : status as ContentStatus) 
      : undefined;
       
    onFilterChange({ ...filter, status: validStatus });
  };

  const handleTypeChange = (type: string) => {
    onFilterChange({ ...filter, type: type === 'all' ? undefined : type });
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Status Filter */}
      <Select onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
          <SelectItem value="scheduled">Scheduled</SelectItem>
        </SelectContent>
      </Select>

      {/* Type Filter */}
      <Select onValueChange={handleTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {contentTypes.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
