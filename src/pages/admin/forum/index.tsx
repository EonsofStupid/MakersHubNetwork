import React from 'react';
import { AdminNav } from "@/components/admin/dashboard/AdminNav";
import { ForumManagement } from "@/components/admin/dashboard/forum/ForumManagement";

const ForumAdminPage = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20">
      <AdminNav />
      <div className="container mx-auto p-6">
        <ForumManagement />
      </div>
    </div>
  );
};

export default ForumAdminPage;