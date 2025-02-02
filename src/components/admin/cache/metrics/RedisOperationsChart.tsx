import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Database } from 'lucide-react';

interface OperationsData {
  time: string;
  commands: number;
  keys: number;
}

interface RedisOperationsChartProps {
  data: OperationsData[];
}

export const RedisOperationsChart = ({ data }: RedisOperationsChartProps) => {
  return (
    <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          Operations Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="time" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              />
              <Bar dataKey="commands" fill="#8884d8" name="Commands/min" />
              <Bar dataKey="keys" fill="#82ca9d" name="Total Keys" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};