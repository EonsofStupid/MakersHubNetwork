import React from 'react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Upload, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export const UserBulkActions = () => {
  const { users, isLoading } = useUserManagement();

  const handleExportUsers = () => {
    try {
      const exportData = users?.map(user => ({
        username: user.username,
        display_name: user.display_name,
        role: user.role,
        created_at: user.created_at,
        last_seen: user.last_seen,
        status: user.is_banned ? 'Banned' : 'Active'
      }));

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString()}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('Users exported successfully');
    } catch (error) {
      console.error('Error exporting users:', error);
      toast.error('Failed to export users');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-[#ff0abe] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-800/50 border border-white/10 rounded-lg p-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Bulk Actions</h2>
        <p className="text-gray-400 mb-6">
          Perform actions on multiple users at once. Be careful with these operations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            onClick={handleExportUsers}
            className="bg-gray-700/50 hover:bg-gray-700/70 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </Button>
          
          <Button
            onClick={() => toast.info('CSV import coming soon')}
            className="bg-gray-700/50 hover:bg-gray-700/70 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import from CSV
          </Button>
          
          <Button
            onClick={() => toast.info('Batch creation coming soon')}
            className="bg-gray-700/50 hover:bg-gray-700/70 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Batch Create
          </Button>
        </div>
      </div>
    </div>
  );
};