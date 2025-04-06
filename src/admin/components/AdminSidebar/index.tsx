
import React from 'react';
import { NavGroup } from '../navigation/NavGroup';
import { NavItem } from '../navigation/NavItem';
import { Home, Settings, Layout, FileText, Users, Database, MessageCircle } from 'lucide-react';

export interface AdminSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ open, onToggle }: AdminSidebarProps) {
  return (
    <aside className={`impulse-sidebar h-screen ${open ? 'w-64' : 'w-16'} transition-all duration-300 flex flex-col`}>
      <div className="p-4 flex items-center justify-between">
        <span className={`text-lg font-semibold cyber-text ${!open && 'sr-only'}`}>
          Admin Panel
        </span>
        <button 
          onClick={onToggle}
          className="impulse-sidebar-icon p-1 rounded hover:bg-primary/10"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {open ? (
              <path d="M15 18l-6-6 6-6" />
            ) : (
              <path d="M9 18l6-6-6-6" />
            )}
          </svg>
        </button>
      </div>
      
      <div className="flex-grow overflow-y-auto admin-scrollbar p-2">
        <NavGroup>
          <NavItem icon={<Home size={20} />} label="Dashboard" path="/admin" expanded={open} />
          <NavItem icon={<Layout size={20} />} label="Layout Editor" path="/admin/layout" expanded={open} />
          <NavItem icon={<FileText size={20} />} label="Content" path="/admin/content" expanded={open} />
          <NavItem icon={<Database size={20} />} label="Builds" path="/admin/builds" expanded={open} />
          <NavItem icon={<MessageCircle size={20} />} label="Comments" path="/admin/comments" expanded={open} />
          <NavItem icon={<Users size={20} />} label="Users" path="/admin/users" expanded={open} />
          <NavItem icon={<Settings size={20} />} label="Settings" path="/admin/settings" expanded={open} />
        </NavGroup>
      </div>
    </aside>
  );
}

export default AdminSidebar;
