import React from 'react';
import { AdminNav } from "@/components/admin/dashboard/AdminNav";
import { ContentManager } from '@/components/content/cms/ContentManager';

const ContentManagement = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20">
      <AdminNav />
      <ContentManager />
    </div>
  );
};

export default ContentManagement;