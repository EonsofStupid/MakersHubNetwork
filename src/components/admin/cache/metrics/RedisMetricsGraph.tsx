import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

interface MetricsData {
  time: string;
  memoryUsage: number;
  hitRate: number;
}

interface RedisMetricsGraphProps {
  data: MetricsData[];
}

export const RedisMetricsGraph = ({ data }: RedisMetricsGraphProps) => {
  return (
    <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="time" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="memoryUsage"
                stroke="#8884d8"
                strokeWidth={2}
                name="Memory Usage (%)"
              />
              <Line
                type="monotone"
                dataKey="hitRate"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Hit Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};