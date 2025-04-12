
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAdminStore } from '@/admin/store/admin.store';
import { EditModeToggle } from './ui/EditModeToggle';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { useAtom } from 'jotai';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

export function AdminLayout() {
  const { initialize } = useAdminStore(); // Changed from initAdmin to initialize
  const [isEditMode] = useAtom(adminEditModeAtom);
  const logger = useLogger('AdminLayout', LogCategory.SYSTEM);
  
  // Initialize admin module
  useEffect(() => {
    logger.info('Initializing Admin layout');
    initialize();
  }, [initialize, logger]);
  
  return (
    <div className="admin-layout">
      <div className="admin-content">
        <Outlet />
      </div>
      {isEditMode && <EditModeToggle />}
    </div>
  );
}
