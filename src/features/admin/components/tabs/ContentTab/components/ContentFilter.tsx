
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ContentFilter } from "@/features/admin/types/content";

interface ContentFilterProps {
  filter: ContentFilter;
  onFilterChange: (filter: ContentFilter) => void;
}

export const ContentFilters = ({ filter, onFilterChange }: ContentFilterProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select
        value={filter.type}
        onValueChange={(value) => onFilterChange({ ...filter, type: value as any })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Content Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="guide">Guide</SelectItem>
          <SelectItem value="tutorial">Tutorial</SelectItem>
          <SelectItem value="part-desc">Part Description</SelectItem>
          <SelectItem value="build-log">Build Log</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filter.status}
        onValueChange={(value) => onFilterChange({ ...filter, status: value as any })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="review">Review</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Search content..."
        value={filter.search || ''}
        onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
        className="w-[200px]"
      />
    </div>
  );
};
