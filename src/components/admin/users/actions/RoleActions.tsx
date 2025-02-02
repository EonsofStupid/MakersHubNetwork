import React from 'react';
import { Shield, UserCog } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UserRole } from '@/components/auth/types';

interface RoleActionsProps {
  onRoleChange: (role: UserRole) => void;
}

export const RoleActions = ({ onRoleChange }: RoleActionsProps) => {
  return (
    <>
      <DropdownMenuItem onClick={() => onRoleChange('admin')}>
        <Shield className="mr-2 h-4 w-4" />
        Make Admin
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={() => onRoleChange('subscriber')}>
        <UserCog className="mr-2 h-4 w-4" />
        Make Subscriber
      </DropdownMenuItem>
    </>
  );
};