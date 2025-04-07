import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  PaintBucket,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { InlineLogIndicator } from '@/logging/components/InlineLogIndicator';
import { LogEntry, LogLevel } from '@/logging/types';
import { LogCategory } from '@/logging/types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Use these sample logs for the log indicators
  const sampleLogs: LogEntry[] = [
    {
      timestamp: Date.now(),
      level: LogLevel.SUCCESS,
      category: LogCategory.THEME,
      message: 'Theme applied successfully',
      source: 'ThemeManager',
      details: { themeName: 'Cyberpunk', appliedTo: 'global' }
    },
    {
      timestamp: Date.now(),
      level: LogLevel.WARN,
      category: LogCategory.AUTH,
      message: 'User login attempt failed',
      source: 'AuthService',
      details: { reason: 'Invalid credentials', attempts: 2 }
    }
  ];
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">143</div>
            <p className="text-xs text-muted-foreground">+2 this week</p>
            <div className="flex items-center mt-4">
              <InlineLogIndicator log={sampleLogs[1]} />
              <span className="text-xs ml-2">Recent login activity</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Theme</CardTitle>
            <PaintBucket className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Cyberpunk</div>
            <p className="text-xs text-muted-foreground">Active theme</p>
            <div className="flex items-center mt-4">
              <InlineLogIndicator log={sampleLogs[0]} />
              <span className="text-xs ml-2">Theme applied</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>System Status</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">All Systems Operational</div>
            <p className="text-xs text-muted-foreground">Last checked: 2m ago</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Alerts</CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Active</div>
            <p className="text-xs text-muted-foreground">View all alerts</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* More dashboard content can be added here */}
      </div>
      
      <div className="flex space-x-2 mt-6">
        <Button onClick={() => navigate('/admin/users')}>
          <Users className="mr-2 h-4 w-4" /> Manage Users
        </Button>
        <Button variant="outline" onClick={() => navigate('/admin/settings')}>
          <Settings className="mr-2 h-4 w-4" /> Settings
        </Button>
        <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
          <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
        </Button>
      </div>
    </div>
  );
};
