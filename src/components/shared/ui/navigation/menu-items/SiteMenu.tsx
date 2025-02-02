import { ListItem } from "../ListItem";
import { Calendar, Clock, History } from "lucide-react";

export const SiteMenu = () => {
  return (
    <div className="grid gap-3 p-4 w-[400px]">
      <div className="grid grid-cols-2 gap-3">
        <ListItem
          href="/content/schedule"
          title="Publication Schedule"
          className="cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neon-cyan" />
            <span>Manage scheduled content publications</span>
          </div>
        </ListItem>
        
        <ListItem
          href="/content/queue"
          title="Publishing Queue"
          className="cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neon-pink" />
            <span>Monitor publishing queue status</span>
          </div>
        </ListItem>

        <ListItem
          href="/content/history"
          title="Publication History"
          className="cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-neon-purple" />
            <span>View publication history and logs</span>
          </div>
        </ListItem>
      </div>
    </div>
  );
};