
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrendingParts } from '@/admin/queries/useTrendingParts';
import { motion } from 'framer-motion';
import { TrendingUp, Box } from 'lucide-react';
import { SimpleCyberText } from '@/components/theme/SimpleCyberText';

export const TrendingParts = () => {
  const { data: trendingParts, isLoading: isLoadingTrending } = useTrendingParts();
  
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };
  
  return (
    <Card className="cyber-card border-primary/20 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending Parts
        </CardTitle>
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
          <motion.div 
            className="space-y-2"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {trendingParts && trendingParts.length > 0 ? (
              trendingParts.map((part, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center justify-between p-2 border-b border-primary/10 hover:bg-primary/5 transition-colors"
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-2">
                    <Box className="h-4 w-4 text-primary" />
                    <span>{part.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm bg-primary/10 px-2 py-0.5 rounded-md flex items-center">
                      {part.community_score ? (
                        <SimpleCyberText 
                          text={`${part.community_score.toFixed(1)} score`} 
                          className="text-primary"
                        />
                      ) : part.review_count ? (
                        <span>{part.review_count} reviews</span>
                      ) : (
                        'No data'
                      )}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">No trending parts found</p>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingParts;
