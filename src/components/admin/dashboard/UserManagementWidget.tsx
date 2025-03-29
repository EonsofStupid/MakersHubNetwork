
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, UserCheck, ShieldAlert, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserItem {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  joinedAt: string;
}

export function UserManagementWidget() {
  const navigate = useNavigate();
  
  // Mock data - in a real app, this would come from an API call
  const recentUsers: UserItem[] = [
    {
      id: "user-1",
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar: "",
      role: "admin",
      status: "active",
      joinedAt: "2023-10-10T08:30:00Z"
    },
    {
      id: "user-2",
      name: "Sarah Miller",
      email: "sarah@example.com",
      avatar: "",
      role: "maker",
      status: "active",
      joinedAt: "2023-10-12T14:45:00Z"
    },
    {
      id: "user-3",
      name: "David Chen",
      email: "david@example.com",
      avatar: "",
      role: "user",
      status: "active",
      joinedAt: "2023-10-14T11:20:00Z"
    }
  ];
  
  const getRoleBadge = (role: string) => {
    let className = "";
    let icon = null;
    
    switch(role) {
      case "admin":
        className = "bg-purple-500/10 text-purple-500 border-purple-500/20";
        icon = <ShieldAlert className="h-3 w-3" />;
        break;
      case "maker":
        className = "bg-blue-500/10 text-blue-500 border-blue-500/20";
        icon = <Award className="h-3 w-3" />;
        break;
      case "moderator":
        className = "bg-green-500/10 text-green-500 border-green-500/20";
        icon = <UserCheck className="h-3 w-3" />;
        break;
      default:
        className = "bg-gray-500/10 text-gray-500 border-gray-500/20";
        icon = <UserPlus className="h-3 w-3" />;
    }
    
    return (
      <Badge variant="outline" className={className}>
        <span className="flex items-center gap-1">
          {icon}
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
      </Badge>
    );
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <Card className="bg-card/80 backdrop-blur-md border border-primary/10 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            User Management
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Recent user activity
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs"
          onClick={() => navigate("/admin/users")}
        >
          Manage Users
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentUsers.length > 0 ? (
            recentUsers.map(user => (
              <div 
                key={user.id}
                className="p-3 rounded-md border border-primary/10 hover:border-primary/30 transition-colors bg-card/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-primary/10 text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-sm">{user.name}</h3>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  {getRoleBadge(user.role)}
                </div>
                <div className="flex justify-end items-center mt-2 text-xs text-muted-foreground">
                  <span>Joined: {formatDate(user.joinedAt)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              No recent user activity
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
