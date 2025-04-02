
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { usePerformanceStore } from "@/stores/performance/store";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export function PerformanceMetrics() {
  const startMonitoring = usePerformanceStore(state => state.startMonitoring);
  const stopMonitoring = usePerformanceStore(state => state.stopMonitoring);
  const isMonitoring = usePerformanceStore(state => state.isMonitoring);
  const frameMetrics = usePerformanceStore(state => state.metrics.frameMetrics);
  const storeMetrics = usePerformanceStore(state => state.metrics.storeMetrics);
  const memoryMetrics = usePerformanceStore(state => state.metrics.memoryMetrics);
  const resetMetrics = usePerformanceStore(state => state.resetMetrics);

  const [frameData, setFrameData] = useState<any[]>([]);
  
  useEffect(() => {
    if (!isMonitoring) {
      startMonitoring();
    }
    
    return () => {
      if (isMonitoring) {
        stopMonitoring();
      }
    };
  }, [isMonitoring, startMonitoring, stopMonitoring]);
  
  useEffect(() => {
    if (frameMetrics.peaks.length > 0) {
      const newDataPoint = {
        time: new Date().toLocaleTimeString(),
        frameTime: frameMetrics.averageTime.toFixed(2),
        drops: frameMetrics.drops
      };
      
      setFrameData(prev => {
        const newData = [...prev, newDataPoint];
        return newData.length > 20 ? newData.slice(-20) : newData;
      });
    }
  }, [frameMetrics]);
  
  const handleReset = () => {
    resetMetrics();
    setFrameData([]);
  };
  
  const formatMemorySize = (bytes: number) => {
    if (bytes < 1024) return `${bytes.toFixed(2)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  
  return (
    <Card className="cyber-card border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Real-time system performance</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={isMonitoring ? "destructive" : "outline"} 
            size="sm"
            onClick={() => isMonitoring ? stopMonitoring() : startMonitoring()}
          >
            {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <Icons.refresh className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="frames">
          <TabsList className="mb-4">
            <TabsTrigger value="frames">Frame Performance</TabsTrigger>
            <TabsTrigger value="memory">Memory Usage</TabsTrigger>
            <TabsTrigger value="store">Store Updates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="frames">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted p-3 rounded-md flex items-center space-x-3">
                  <Icons.gauge className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Frame Time</p>
                    <p className="text-lg font-semibold">{frameMetrics.averageTime.toFixed(2)}ms</p>
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-md flex items-center space-x-3">
                  <Icons.cpu className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Frame Drops</p>
                    <p className="text-lg font-semibold">{frameMetrics.drops}</p>
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-md flex items-center space-x-3">
                  <Icons.refresh className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last Update</p>
                    <p className="text-lg font-semibold">
                      {frameMetrics.lastTimestamp > 0 
                        ? new Date(frameMetrics.lastTimestamp).toLocaleTimeString() 
                        : "Never"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="h-[250px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={frameData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="frameTime" 
                      name="Frame Time (ms)" 
                      stroke="var(--primary)" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="memory">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-3 rounded-md flex items-center space-x-3">
                  <Icons.database className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Heap Size</p>
                    <p className="text-lg font-semibold">{formatMemorySize(memoryMetrics.heapSize)}</p>
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-md flex items-center space-x-3">
                  <Icons.refresh className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last GC</p>
                    <p className="text-lg font-semibold">
                      {memoryMetrics.lastGC 
                        ? new Date(memoryMetrics.lastGC).toLocaleTimeString() 
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="h-[250px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Used Memory', value: memoryMetrics.heapSize / (1024 * 1024) }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'MB', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => {
                      if (typeof value === 'number') {
                        return [`${value.toFixed(2)} MB`, 'Memory Usage'];
                      }
                      return [value, 'Memory Usage'];
                    }} />
                    <Bar dataKey="value" fill="var(--primary)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="store">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted p-3 rounded-md flex items-center space-x-3">
                  <Icons.cpu className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Update Count</p>
                    <p className="text-lg font-semibold">{storeMetrics.updates}</p>
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-md flex items-center space-x-3">
                  <Icons.gauge className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Compute Time</p>
                    <p className="text-lg font-semibold">{storeMetrics.computeTime.toFixed(2)}ms</p>
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-md flex items-center space-x-3">
                  <Icons.refresh className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Update Time</p>
                    <p className="text-lg font-semibold">
                      {storeMetrics.updates > 0 
                        ? (storeMetrics.computeTime / storeMetrics.updates).toFixed(2) 
                        : "0.00"}ms
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="h-[250px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Array.from(storeMetrics.subscribers.entries()).map(([name, count]) => ({
                    name,
                    subscribers: count
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="subscribers" name="Subscribers" fill="var(--primary)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Default export for React.lazy compatibility
export default PerformanceMetrics;
