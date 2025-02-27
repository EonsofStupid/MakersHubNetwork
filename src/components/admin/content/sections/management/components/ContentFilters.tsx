
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContentFiltersProps } from '../../../types/content.types';

export const ContentFilters = ({ filter, onFilterChange }: ContentFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Input
        placeholder="Search content..."
        value={filter.search || ''}
        onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
        className="w-[200px] glass-morphism mad-scientist-hover"
      />
      
      <Select
        value={filter.type}
        onValueChange={(value) => onFilterChange({ ...filter, type: value })}
      >
        <SelectTrigger className="w-[180px] glass-morphism mad-scientist-hover">
          <SelectValue placeholder="Content Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="article">Article</SelectItem>
          <SelectItem value="tutorial">Tutorial</SelectItem>
          <SelectItem value="announcement">Announcement</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filter.status}
        onValueChange={(value) => onFilterChange({ ...filter, status: value })}
      >
        <SelectTrigger className="w-[180px] glass-morphism mad-scientist-hover">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
