
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ContentFilter } from "../../types/content";
import { motion } from "framer-motion";

interface ContentFilterProps {
  filter: ContentFilter;
  onFilterChange: (filter: ContentFilter) => void;
}

export const ContentFilters = ({ filter, onFilterChange }: ContentFilterProps) => {
  return (
    <motion.div 
      className="flex flex-wrap gap-4 mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Select
        value={filter.type}
        onValueChange={(value) => onFilterChange({ ...filter, type: value as any })}
      >
        <SelectTrigger className="w-[180px] glass-morphism mad-scientist-hover">
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
        <SelectTrigger className="w-[180px] glass-morphism mad-scientist-hover">
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
        className="w-[200px] glass-morphism mad-scientist-hover placeholder:text-muted-foreground/50"
      />
    </motion.div>
  );
};
