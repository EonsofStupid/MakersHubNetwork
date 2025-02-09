import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Star, FileText, Users, UserCheck, Component, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useActiveUsersCount } from '../../queries/useActiveUsersCount';
import { useTotalUsersCount } from '../../queries/useTotalUsersCount';
import { usePartsCount } from '../../queries/usePartsCount';
import { useReviewsCount } from '../../queries/useReviewsCount';
import { useTrendingParts } from '../../queries/useTrendingParts';
import { useRecentReviews } from '../../queries/useRecentReviews';
import { useToast } from '@/hooks/use-toast';

export const OverviewTab = () => {
  const { toast } = useToast();
  const { 
    count: activeUsers, 
    isLoading: loadingActive, 
    error: activeError,
    refresh: refreshActive 
  } = useActiveUsersCount();
  
  const { 
    data: totalUsers, 
    isLoading: loadingTotal,
    isError: totalError,
    refetch: refreshTotal
  } = useTotalUsersCount();

  const { data: partsCount, isLoading: loadingParts } = usePartsCount();
  const { data: reviewsCount, isLoading: loadingReviews } = useReviewsCount();
  const { data: trendingParts, isLoading: loadingTrending } = useTrendingParts();
  const { data: recentReviews, isLoading: loadingRecentReviews } = useRecentReviews();

  const handleRefresh = async () => {
    try {
      await refreshActive();
      await refreshTotal();
      toast({
        title: "Refreshed",
        description: "User counts have been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refresh user counts.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <CardDescription>Currently active users</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleRefresh}
                disabled={loadingActive}
              >
                <RefreshCw className={`h-4 w-4 text-muted-foreground ${loadingActive ? 'animate-spin' : ''}`} />
              </Button>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeError ? (
                <span className="text-destructive">Error</span>
              ) : loadingActive ? (
                <span className="opacity-70">...</span>
              ) : (
                activeUsers
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Real-time active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <CardDescription>Registered accounts</CardDescription>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalError ? (
                <span className="text-destructive">Error</span>
              ) : loadingTotal ? (
                <span className="opacity-70">...</span>
              ) : (
                totalUsers
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Printer Parts</CardTitle>
              <CardDescription>Total parts in catalog</CardDescription>
            </div>
            <Component className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingParts ? '...' : partsCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Total parts available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Reviews</CardTitle>
              <CardDescription>User submitted reviews</CardDescription>
            </div>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingReviews ? '...' : reviewsCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Total submitted reviews
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Trending Parts
            </CardTitle>
            <CardDescription>Top rated printer parts</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingTrending ? (
              <p>Loading trending parts...</p>
            ) : (
              <div className="space-y-4">
                {trendingParts?.map((part, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{part.name}</span>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{part.community_score?.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">
                        ({part.review_count} reviews)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Reviews
            </CardTitle>
            <CardDescription>Latest user feedback</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingRecentReviews ? (
              <p>Loading recent reviews...</p>
            ) : (
              <div className="space-y-4">
                {recentReviews?.map((review, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{review.printer_parts?.name}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
