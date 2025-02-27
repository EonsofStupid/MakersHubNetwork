
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const mockData = [
  { date: 'Jun 1', requests: 45, tokens: 12500 },
  { date: 'Jun 2', requests: 52, tokens: 14200 },
  { date: 'Jun 3', requests: 49, tokens: 13100 },
  { date: 'Jun 4', requests: 63, tokens: 16800 },
  { date: 'Jun 5', requests: 71, tokens: 18900 },
  { date: 'Jun 6', requests: 74, tokens: 19500 },
  { date: 'Jun 7', requests: 82, tokens: 21700 },
];

export const UsagePanel = () => {
  return (
    <div className="space-y-6">
      <Card className="cyber-card backdrop-blur-sm bg-background/50">
        <CardHeader>
          <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Usage Analytics
          </CardTitle>
          <CardDescription>
            Track AI service usage and monitor costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="text-sm text-muted-foreground">Total Requests</div>
              <div className="text-3xl font-bold text-primary mt-2">1,254</div>
              <div className="text-xs text-muted-foreground mt-1">+12% from last month</div>
            </Card>
            
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="text-sm text-muted-foreground">Total Tokens</div>
              <div className="text-3xl font-bold text-primary mt-2">341,750</div>
              <div className="text-xs text-muted-foreground mt-1">+8% from last month</div>
            </Card>
            
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="text-sm text-muted-foreground">Estimated Cost</div>
              <div className="text-3xl font-bold text-primary mt-2">$14.32</div>
              <div className="text-xs text-muted-foreground mt-1">Based on current pricing</div>
            </Card>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Usage This Week</h3>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#00f0ff" />
                  <YAxis yAxisId="right" orientation="right" stroke="#ff2d6e" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(0,240,255,0.2)',
                      borderRadius: '6px'
                    }} 
                  />
                  <Bar yAxisId="left" dataKey="requests" fill="#00f0ff" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="tokens" fill="#ff2d6e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
