
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ContentType, ContentStatus } from '../../types/content';
import { ContentFilter } from '../../types/query.types';

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
  return (
    <div className="flex flex-wrap gap-4">
      <Input
        placeholder="Search content..."
        value={currentFilter.search || ''}
        onChange={(e) => onFilterChange({
          ...currentFilter,
          search: e.target.value
        })}
        className="w-[200px] glass-morphism"
      />
      
      <Select
        value={currentFilter.type}
        onValueChange={(value) => onFilterChange({
          ...currentFilter,
          type: value
        })}
      >
        <SelectTrigger className="w-[180px] glass-morphism">
          <SelectValue placeholder="Content Type" />
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

      <Select
        value={currentFilter.status}
        onValueChange={(value) => onFilterChange({
          ...currentFilter,
          status: value as ContentStatus
        })}
      >
        <SelectTrigger className="w-[180px] glass-morphism">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Status</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
          <SelectItem value="review">Review</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
