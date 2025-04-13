
import React from 'react';

export interface BuildApprovalWidgetProps {
  className?: string;
}

export function BuildApprovalWidget({ className = '' }: BuildApprovalWidgetProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-medium mb-2">Pending Approvals</h3>
      <p className="text-sm text-muted-foreground">No pending build approvals</p>
    </div>
  );
}

export default BuildApprovalWidget;
