import React from 'react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { Loader2, User } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RoleSelector } from './RoleSelector';
import { UserTableRowActions } from './UserTableRowActions';
import { ErrorState } from '@/components/shared/error-handling/ErrorState';
import { UserRole } from '@/components/auth/types';

interface UsersListProps {
  searchQuery: string;
}

export const UsersList = ({ searchQuery }: UsersListProps) => {
  const { users, isLoading, error, refetch, updateRole } = useUserManagement();

  const filteredProfiles = users?.filter((profile) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      profile.username?.toLowerCase().includes(searchLower) ||
      profile.display_name?.toLowerCase().includes(searchLower) ||
      profile.role?.toLowerCase().includes(searchLower)
    );
  });

  const handleRoleChange = async (userId: string, role: UserRole) => {
    try {
      await updateRole.mutateAsync({ userId, newRole: role });
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-[#ff0abe] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState 
        title="Failed to load users" 
        message="There was an error loading the user list. Please try again." 
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="bg-gray-800/50 border border-white/10 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-white">User</TableHead>
            <TableHead className="text-white">Role</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Location</TableHead>
            <TableHead className="text-white">Last Seen</TableHead>
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProfiles?.map((profile) => (
            <TableRow 
              key={profile.id}
              className="border-white/10 hover:bg-white/5"
            >
              <TableCell className="font-medium text-white">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-white/10">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback className="bg-gray-700 text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{profile.display_name || 'Unnamed User'}</div>
                    {profile.username && (
                      <div className="text-sm text-gray-400">@{profile.username}</div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <RoleSelector
                  currentRole={profile.role || 'subscriber'}
                  onRoleChange={(role) => handleRoleChange(profile.id, role)}
                  disabled={profile.is_banned}
                />
              </TableCell>
              <TableCell>
                {profile.is_banned ? (
                  <Badge variant="destructive">Banned</Badge>
                ) : (
                  <Badge variant="secondary">Active</Badge>
                )}
              </TableCell>
              <TableCell className="text-gray-400">
                {profile.location || 'Not specified'}
              </TableCell>
              <TableCell className="text-gray-400">
                {profile.last_seen 
                  ? new Date(profile.last_seen).toLocaleDateString()
                  : 'Never'
                }
              </TableCell>
              <TableCell>
                <UserTableRowActions 
                  userId={profile.id}
                  currentRole={profile.role || 'subscriber'}
                  isBanned={profile.is_banned}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};