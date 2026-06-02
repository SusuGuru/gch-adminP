import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Trash2, Star } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar.jsx';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import goldCoastApiClient from '@/lib/goldCoastApiClient';

function ReviewsManager() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteReviewId, setDeleteReviewId] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const data = await goldCoastApiClient.getReviews();
        setReviews(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDeleteReview = async () => {
    if (!deleteReviewId) return;

    try {
      await goldCoastApiClient.deleteReview(deleteReviewId);
      setReviews(reviews.filter(review => review.id !== deleteReviewId));
      toast.success('Review deleted');
      setDeleteReviewId(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete review');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  let reviewsContent;
  if (isLoading) {
    reviewsContent = (
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  } else if (reviews.length === 0) {
    reviewsContent = (
      <div className="p-12 text-center">
        <p className="text-muted-foreground text-lg">No reviews found</p>
      </div>
    );
  } else {
    reviewsContent = (
      <table className="admin-table">
        <thead>
          <tr>
            <th>Review ID</th>
            <th>Product</th>
            <th>Author</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td className="font-mono text-xs">#{review.id}</td>
              <td className="font-medium">{review.productName || 'Unknown Product'}</td>
              <td>{review.authorName || review.authorEmail || 'Anonymous'}</td>
              <td>{renderStars(review.rating || 0)}</td>
              <td className="max-w-xs truncate">{review.comment || 'No comment'}</td>
              <td>{new Date(review.createdAt).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteReviewId(review.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reviews - Gold Coast Admin</title>
        <meta name="description" content="Manage reviews for Gold Coast Honey" />
      </Helmet>

      <div className="flex min-h-screen">
        <AdminSidebar />
        
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Reviews Management</h1>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                {error}
              </div>
            )}

            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {reviewsContent}
            </div>
          </div>
        </main>
      </div>

      <AlertDialog open={!!deleteReviewId} onOpenChange={() => setDeleteReviewId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReview}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ReviewsManager;