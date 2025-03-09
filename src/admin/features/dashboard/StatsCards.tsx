
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePartsCount } from '@/admin/queries/usePartsCount';
import { useTotalUsersCount } from '@/admin/queries/useTotalUsersCount';
import { useReviewsCount } from '@/admin/queries/useReviewsCount';
import { motion } from 'framer-motion';
import { Box, Layers, Star, Users } from 'lucide-react';

export const StatsCards = () => {
  const { data: partsCount, isLoading: isLoadingParts } = usePartsCount();
  const { data: usersCount, isLoading: isLoadingUsers } = useTotalUsersCount();
  const { data: reviewsCount, isLoading: isLoadingReviews } = useReviewsCount();

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const cards = [
    {
      title: "Total Parts",
      description: "Number of parts in database",
      value: partsCount,
      loading: isLoadingParts,
      icon: <Layers className="h-5 w-5 text-primary" />,
      color: "from-primary/20 to-primary/5"
    },
    {
      title: "Users",
      description: "Total registered users",
      value: usersCount,
      loading: isLoadingUsers,
      icon: <Users className="h-5 w-5 text-secondary" />,
      color: "from-secondary/20 to-secondary/5"
    },
    {
      title: "Reviews",
      description: "Total submitted reviews",
      value: reviewsCount,
      loading: isLoadingReviews,
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      color: "from-yellow-500/20 to-yellow-500/5"
    },
    {
      title: "Activity Score",
      description: "Community engagement level",
      value: "95.7%",
      loading: false,
      icon: <Box className="h-5 w-5 text-green-500" />,
      color: "from-green-500/20 to-green-500/5"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="h-full"
        >
          <Card className="cyber-card border-primary/20 overflow-hidden relative h-full">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-30`}></div>
            <CardHeader className="pb-2 relative">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {card.icon}
                    {card.title}
                  </CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-3xl font-bold cyber-text-glow">
                {card.loading ? (
                  <span className="inline-block w-16 h-8 bg-muted/50 animate-pulse rounded"></span>
                ) : (
                  card.value
                )}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
