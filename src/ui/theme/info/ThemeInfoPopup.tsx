
import { InfoIcon } from "lucide-react";
import { Button } from "@/ui/core/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/core/popover";
import { ThemeInfoTabs } from "./ThemeInfoTabs";

export function ThemeInfoPopup() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Theme information">
          <InfoIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <ThemeInfoTabs />
      </PopoverContent>
    </Popover>
  );
}
