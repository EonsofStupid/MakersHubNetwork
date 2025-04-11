
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/core/card';
import { Alert, AlertDescription, AlertTitle } from '@/ui/core/alert';
import { useReviewAdminStore } from "@/admin/store/reviewAdmin.store";
import { Star, AlertTriangle } from "lucide-react";
import { Button } from '@/ui/core/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/core/tabs';

export function ReviewsOverview() {
  const { error, pendingReviews, isLoading, fetchPendingReviews } = useReviewAdminStore();
  
  // Fetch pending reviews on component mount
  React.useEffect(() => {
    fetchPendingReviews();
  }, [fetchPendingReviews]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Reviews Management</h1>
          <p className="text-muted-foreground">
            Review and moderate user-submitted reviews for 3D printer builds
          </p>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
          <TabsTrigger value="approved">Approved Reviews</TabsTrigger>
          <TabsTrigger value="flagged">Flagged Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5" />
                Pending Reviews
              </CardTitle>
              <CardDescription>
                Review and moderate user-submitted reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : pendingReviews.length > 0 ? (
                <div className="space-y-4">
                  {pendingReviews.map((review) => (
                    <Card key={review.id} className="p-4 border border-border/60">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{review.title}</h3>
                            <div className="flex">
                              {Array(review.rating).fill(0).map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{review.body.substring(0, 100)}...</p>
                          <div className="text-xs text-muted-foreground mt-2">
                            By {review.reviewer_name || 'Anonymous'} • {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => useReviewAdminStore.getState().approveReview(review.id)}>
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => useReviewAdminStore.getState().rejectReview(review.id)}>
                            Reject
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p>No pending reviews to display</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="approved">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Approved reviews will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="flagged">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Flagged reviews will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
