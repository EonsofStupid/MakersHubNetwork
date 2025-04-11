
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/ui/core/hover-card";
import { InfoIcon } from "lucide-react";

interface TextWithPopupProps {
  text: string;
  popupContent: React.ReactNode;
}

export function TextWithPopup({ text, popupContent }: TextWithPopupProps) {
  return (
    <div className="flex items-center gap-1 font-medium">
      {text}
      <HoverCard>
        <HoverCardTrigger asChild>
          <InfoIcon className="h-3 w-3 cursor-help text-muted-foreground" />
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          {popupContent}
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
