
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/shared/ui/popover";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { useBuildAdminStore } from "@/admin/store/buildAdmin.store";
import { BuildStatus } from "@/shared/types/build.types";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter, SortDesc, RotateCcw } from "lucide-react";

export function BuildsFilters() {
  const { filters, updateFilters } = useBuildAdminStore();
  const { status, dateRange, sortBy } = filters;
  
  const resetFilters = () => {
    updateFilters({
      status: null,
      dateRange: {
        from: undefined,
        to: undefined
      },
      sortBy: 'newest'
    });
  };
  
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filters:</span>
      </div>
      
      {/* Status filter */}
      <Select 
        value={status || 'all'} 
        onValueChange={(value) => {
          if (value === 'all') {
            updateFilters({ status: null });
          } else {
            updateFilters({ status: value as BuildStatus });
          }
        }}
      >
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="needs_revision">Needs Revision</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Date range filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 flex items-center gap-2"
          >
            <CalendarIcon className="w-4 h-4" />
            {dateRange && dateRange.from && dateRange.to ? (
              `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`
            ) : (
              "Date Range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={{
              from: dateRange?.from,
              to: dateRange?.to,
            }}
            onSelect={(range) => {
              updateFilters({
                dateRange: {
                  from: range?.from,
                  to: range?.to
                }
              });
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      
      {/* Sort filter */}
      <Select 
        value={sortBy || 'newest'} 
        onValueChange={(value) => updateFilters({ sortBy: value as any })}
      >
        <SelectTrigger className="w-[140px] h-9">
          <div className="flex items-center gap-2">
            <SortDesc className="w-4 h-4" />
            <SelectValue placeholder="Sort By" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="complexity">Complexity</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Reset button */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={resetFilters}
        className="h-9 ml-auto"
      >
        <RotateCcw className="w-4 h-4 mr-1" />
        Reset
      </Button>
    </div>
  );
}
