
import React from "react";
import { Button } from '@/ui/core/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useBuildAdminStore } from "@/admin/store/buildAdmin.store";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from "lucide-react";

export function BuildsPagination() {
  const { pagination, updatePagination } = useBuildAdminStore();
  const { page, perPage, total } = pagination;
  
  const totalPages = Math.ceil(total / perPage);
  const startRecord = (page - 1) * perPage + 1;
  const endRecord = Math.min(startRecord + perPage - 1, total);
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updatePagination({ page: newPage });
    }
  };
  
  const handlePerPageChange = (value: string) => {
    updatePagination({ perPage: parseInt(value), page: 1 });
  };
  
  return (
    <div className="flex items-center justify-between py-4">
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <span>Show</span>
        <Select
          value={perPage.toString()}
          onValueChange={handlePerPageChange}
        >
          <SelectTrigger className="w-[70px] h-8">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span>
          {total > 0 
            ? `${startRecord}-${endRecord} of ${total} builds`
            : "No builds"
          }
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handlePageChange(1)}
          disabled={page === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm">
          Page {page} of {totalPages || 1}
        </span>
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handlePageChange(totalPages)}
          disabled={page >= totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
