
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Star, FileText } from 'lucide-react';
import { useActiveUsersCount } from '../../queries/useActiveUsersCount';
import { usePartsCount } from '../../queries/usePartsCount';
import { useReviewsCount } from '../../queries/useReviewsCount';
import { useTrendingParts } from '../../queries/useTrendingParts';
import { useRecentReviews } from '../../queries/useRecentReviews';

export const OverviewTab = () => {
  const { data: activeUsersCount, isLoading: loadingUsers } = useActiveUsersCount();
  const { data: partsCount, isLoading: loadingParts } = usePartsCount();
  const { data: reviewsCount, isLoading: loadingReviews } = useReviewsCount();
  const { data: trendingParts, isLoading: loadingTrending } = useTrendingParts();
  const { data: recentReviews, isLoading: loadingRecentReviews } = useRecentReviews();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Currently registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-3xl font-bold">
                {loadingUsers ? '...' : activeUsersCount || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Printer Parts</CardTitle>
            <CardDescription>Total printer components</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {loadingParts ? '...' : partsCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>User submitted reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {loadingReviews ? '...' : reviewsCount}
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

