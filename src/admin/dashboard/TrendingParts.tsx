
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/core/card';
import { useTrendingParts } from '@/admin/queries/useTrendingParts';

export function TrendingParts() {
  const { data: trendingParts, isLoading: isLoadingTrending } = useTrendingParts();
  
  return (
    <Card className="cyber-card border-primary/20">
      <CardHeader>
        <CardTitle>Trending Parts</CardTitle>
        <CardDescription>Most viewed in the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingTrending ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-2 border-b border-primary/10 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-primary/20"></div>
                  <div className="h-4 w-32 bg-primary/20 rounded"></div>
                </div>
                <div className="h-4 w-16 bg-primary/10 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {trendingParts && trendingParts.length > 0 ? (
              trendingParts.map((part, index) => (
                <div key={index} className="flex items-center justify-between p-2 border-b border-primary/10">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-primary/70">#{index + 1}</span>
                    <span>{part.name}</span>
                  </div>
                  <span className="text-sm bg-primary/10 px-2 py-0.5 rounded">
                    {part.community_score ? `${part.community_score.toFixed(1)} score` : 
                     part.review_count ? `${part.review_count} reviews` : 'No data'}
                  </span>
                </div>
              ))
            ) : (
              <p>No trending parts found</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
