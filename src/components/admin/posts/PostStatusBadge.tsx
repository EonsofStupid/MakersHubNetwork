import React from "react";
import { Badge } from "@/components/ui/badge";

interface PostStatusBadgeProps {
  status: string | null;
}

export const PostStatusBadge: React.FC<PostStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'published':
      return (
        <Badge className="bg-[#41f0db]/10 text-[#41f0db] hover:bg-[#41f0db]/20 border-0">
          Published
        </Badge>
      );
    case 'draft':
      return (
        <Badge className="bg-[#ff0abe]/10 text-[#ff0abe] hover:bg-[#ff0abe]/20 border-0">
          Draft
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="border-zinc-700 text-zinc-400">
          {status || 'Unknown'}
        </Badge>
      );
  }
};