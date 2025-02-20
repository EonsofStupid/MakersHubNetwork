
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ContentType, ContentFilter } from '../../types/content';

interface ContentFiltersProps {
  contentTypes: ContentType[];
  currentFilter: ContentFilter;
  onFilterChange: (filter: ContentFilter) => void;
}

export const ContentFilters = ({ 
  contentTypes,
  currentFilter,
  onFilterChange,
}: ContentFiltersProps) => {
  const handleTypeChange = (value: string) => {
    onFilterChange({
      ...currentFilter,
      type: value,
    });
  };

  return (
    <div className="flex gap-4">
      <div className="w-[200px]">
        <Select
          value={currentFilter.type}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            {contentTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
