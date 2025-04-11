
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/ui/core/button';

export function BuildApprovalWidget() {
  // Sample data for pending approvals
  const pendingApprovals = [
    {
      id: 'build-1',
      name: 'Ender 3 V2 Direct Drive Mod',
      author: 'JohnMaker',
      submitted: '2 days ago',
      type: 'modification'
    },
    {
      id: 'build-2',
      name: 'CR-10 Improved Fan Duct',
      author: 'PrinterPro',
      submitted: '3 days ago',
      type: 'accessory'
    },
    {
      id: 'build-3',
      name: 'Prusa i3 MK3S+ Enclosure',
      author: 'MakerSpace',
      submitted: '1 week ago',
      type: 'enclosure'
    }
  ];
  
  const handleApprove = (id: string) => {
    console.log(`Approved build: ${id}`);
  };
  
  const handleReject = (id: string) => {
    console.log(`Rejected build: ${id}`);
  };
  
  return (
    <div className="space-y-4">
      {pendingApprovals.length === 0 ? (
        <div className="text-center py-6 text-[var(--impulse-text-secondary)]">
          No builds waiting for approval
        </div>
      ) : (
        <div className="space-y-3">
          {pendingApprovals.map((build) => (
            <div 
              key={build.id}
              className="border border-[var(--impulse-border)] rounded-md p-3 bg-[var(--impulse-bg-muted)]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-[var(--impulse-text-primary)]">{build.name}</h3>
                  <div className="text-sm text-[var(--impulse-text-secondary)]">
                    By {build.author} • {build.submitted}
                  </div>
                  <div className="mt-1">
                    <span className="inline-flex items-center rounded-full bg-[var(--impulse-bg-muted)] px-2 py-1 text-xs font-medium">
                      {build.type}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-red-100/10"
                    onClick={() => handleReject(build.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button 
                    size="sm"
                    variant="ghost" 
                    className="text-green-500 hover:text-green-600 hover:bg-green-100/10"
                    onClick={() => handleApprove(build.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="text-center">
        <Button variant="outline" size="sm">
          View All Pending Approvals
        </Button>
      </div>
    </div>
  );
}
