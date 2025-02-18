
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ContentFilter, ContentStatus } from "../../types/content";
import { motion } from "framer-motion";
import { useContentTypes } from "../../queries/useContentTypes";
import { ContentTypeManager } from "./ContentTypeManager";

interface ContentFilterProps {
  filter: ContentFilter;
  onFilterChange: (filter: ContentFilter) => void;
}

export const ContentFilters = ({ filter, onFilterChange }: ContentFilterProps) => {
  const { data: contentTypes, isLoading } = useContentTypes();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <motion.div 
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Select
            value={filter.type}
            onValueChange={(value) => onFilterChange({ ...filter, type: value })}
          >
            <SelectTrigger className="w-[180px] glass-morphism mad-scientist-hover">
              <SelectValue placeholder="Content Type" />
            </SelectTrigger>
            <SelectContent>
              {contentTypes?.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filter.status}
            onValueChange={(value) => onFilterChange({ ...filter, status: value as ContentStatus })}
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

        <ContentTypeManager />
      </div>
    </div>
  );
};
