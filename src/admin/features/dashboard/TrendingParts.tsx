
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrendingParts } from "@/admin/queries/useTrendingParts";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export const TrendingParts = () => {
  const { data: trendingParts, isLoading } = useTrendingParts();

  return (
    <Card className="cyber-card border-primary/20 overflow-hidden h-full">
      <CardHeader className="pb-2 relative bg-gradient-to-r from-primary/20 to-transparent">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending Parts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <TrendingPartsLoading />
        ) : trendingParts && trendingParts.length > 0 ? (
          <ul className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
            {trendingParts.map((part, index) => (
              <motion.li
                key={part.id}
                className="relative"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bg-primary/5 border border-primary/20 rounded-md p-3 hover:bg-primary/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{part.name}</h4>
                      <p className="text-xs text-muted-foreground">{part.category}</p>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3" />
                      {part.growth}%
                    </Badge>
                  </div>
                  <div className="h-[40px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={part.trend}>
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border border-primary/20 p-2 rounded text-xs">
                                  <p>Views: {payload[0].value}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <XAxis dataKey="name" hide />
                        <Line 
                          type="monotone" 
                          dataKey="views" 
                          stroke="var(--primary)" 
                          strokeWidth={2} 
                          dot={false} 
                          activeDot={{ r: 4, strokeWidth: 1 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="text-center p-6 text-muted-foreground">
            <p>No trending parts data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TrendingPartsLoading = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <div key={index} className="border border-primary/10 rounded-md p-3">
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-[40px] w-full mt-2" />
        </div>
      ))}
    </div>
  );
};
