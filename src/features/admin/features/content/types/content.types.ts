
export interface ContentFilter {
  search?: string;
  type?: string;
  status?: string;
  category?: string;
}

export interface ContentListProps {
  filter: ContentFilter;
}

export interface ContentFiltersProps {
  filter: ContentFilter;
  onFilterChange: (filter: ContentFilter) => void;
}
