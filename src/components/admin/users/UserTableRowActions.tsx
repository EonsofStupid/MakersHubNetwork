import React, { useState } from 'react';
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUserManagement } from '@/hooks/useUserManagement';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from "sonner";
import { BanUserDialog } from './BanUserDialog';
import { UserRole } from '@/components/auth/types';
import { BanAction } from './actions/BanAction';
import { UnbanAction } from './actions/UnbanAction';
import { RoleActions } from './actions/RoleActions';
import { ViewActivityAction } from './actions/ViewActivityAction';

interface UserTableRowActionsProps {
  userId: string;
  currentRole: UserRole;
  isBanned?: boolean;
}

export function UserTableRowActions({ userId, currentRole, isBanned }: UserTableRowActionsProps) {
  const { updateRole, getUserActivity, getUserCMSActivity } = useUserManagement();
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [activityData, setActivityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleViewActivity = async () => {
    setIsLoading(true);
    try {
      const [activity, cmsActivity] = await Promise.all([
        getUserActivity(userId),
        getUserCMSActivity(userId)
      ]);
      setActivityData({ activity, cmsActivity });
      setShowActivityDialog(true);
    } catch (error) {
      console.error('Error fetching activity:', error);
      toast.error('Failed to load user activity');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleUpdate = async (newRole: UserRole) => {
    try {
      await updateRole.mutateAsync({ userId, newRole });
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          
          <RoleActions onRoleChange={handleRoleUpdate} />
          
          <DropdownMenuSeparator />
          
          <ViewActivityAction onViewActivity={handleViewActivity} />

          <DropdownMenuSeparator />

          {isBanned ? (
            <UnbanAction userId={userId} />
          ) : (
            <BanAction userId={userId} onBanClick={() => setShowBanDialog(true)} />
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Activity History</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[500px] p-4">
            {activityData && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">General Activity</h3>
                  {activityData.activity?.map((item: any) => (
                    <div key={item.id} className="mb-2 p-2 bg-black/20 rounded">
                      <p className="text-sm">{item.details}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">CMS Activity</h3>
                  {activityData.cmsActivity?.map((item: any) => (
                    <div key={item.id} className="mb-2 p-2 bg-black/20 rounded">
                      <p className="text-sm">
                        {item.activity_type} - {item.cms_content?.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <BanUserDialog
        isOpen={showBanDialog}
        onClose={() => setShowBanDialog(false)}
        onConfirm={(reason) => {
          // Handle ban confirmation
          setShowBanDialog(false);
        }}
        username={userId}
      />
    </>
  );
}