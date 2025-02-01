import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SearchButton = () => {
  return (
    <Button variant="ghost" size="icon" className="mad-scientist-hover">
      <Search className="h-5 w-5" />
    </Button>
  );
};