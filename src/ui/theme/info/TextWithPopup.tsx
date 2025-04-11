
import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/ui/core/hover-card";
import { InfoIcon } from "lucide-react";

interface TextWithPopupProps {
  text: string;
  label?: string;
}

export function TextWithPopup({ text, label }: TextWithPopupProps) {
  return (
    <div className="flex items-center gap-1">
      {label && <span className="text-sm text-muted-foreground">{label}:</span>}
      <span className="text-sm truncate max-w-[200px]">{text}</span>
      <HoverCard>
        <HoverCardTrigger asChild>
          <InfoIcon className="h-3 w-3 cursor-help text-muted-foreground hover:text-foreground" />
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{label || "Details"}</h4>
            <p className="text-sm break-all">{text}</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
