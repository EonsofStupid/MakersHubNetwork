import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from '@/components/auth/types';

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  disabled?: boolean;
}

export const RoleSelector = ({ currentRole, onRoleChange, disabled }: RoleSelectorProps) => {
  return (
    <Select
      defaultValue={currentRole}
      onValueChange={(value: UserRole) => onRoleChange(value)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[130px] bg-gray-800/50 border-white/10 text-white">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-white/10">
        <SelectItem value="subscriber" className="text-white hover:bg-white/5">
          Subscriber
        </SelectItem>
        <SelectItem value="maker" className="text-white hover:bg-white/5">
          Maker
        </SelectItem>
        <SelectItem value="admin" className="text-white hover:bg-white/5">
          Admin
        </SelectItem>
        <SelectItem value="super_admin" className="text-white hover:bg-white/5">
          Super Admin
        </SelectItem>
      </SelectContent>
    </Select>
  );
};