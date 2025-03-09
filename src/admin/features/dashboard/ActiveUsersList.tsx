
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActiveUsers } from "@/admin/hooks/useActiveUsers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { User } from "lucide-react";

export const ActiveUsersList = () => {
  const { data: activeUsers, isLoading } = useActiveUsers();

  return (
    <Card className="cyber-card border-primary/20 overflow-hidden h-full">
      <CardHeader className="pb-2 relative bg-gradient-to-r from-primary/20 to-transparent">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-primary" />
          Active Users
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <ActiveUsersLoading />
        ) : activeUsers && activeUsers.length > 0 ? (
          <ul className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
            {activeUsers.map((user, index) => (
              <motion.li
                key={user.id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-primary/5 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Avatar className="h-8 w-8 border border-primary/20">
                  <AvatarImage src={user.avatarUrl} alt={user.username} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.username}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn(
                    "text-xs border-primary/20",
                    user.online ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                  )}>
                    {user.online ? "Online" : "Away"}
                  </Badge>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {user.lastActive}
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="text-center p-6 text-muted-foreground">
            <p>No active users at the moment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ActiveUsersLoading = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((index) => (
        <div key={index} className="flex items-center gap-3 p-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
};
