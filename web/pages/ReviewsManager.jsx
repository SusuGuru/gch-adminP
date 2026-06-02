import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Trash2, Star } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import goldCoastApiClient from "@/lib/goldCoastApiClient";

function ReviewsManager() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteReviewId, setDeleteReviewId] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const data = await goldCoastApiClient.getReviews();
        setReviews(data);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load reviews");
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
      setReviews(reviews.filter(r => r.id !== deleteReviewId));
      toast.success("Review deleted");
      setDeleteReviewId(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete review");
    }
  };

  const renderStars = (rating) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

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
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">Review ID</th>
            <th className="text-left p-3">Product</th>
            <th className="text-left p-3">Author</th>
            <th className="text-left p-3">Rating</th>
            <th className="text-left p-3">Comment</th>
            <th className="text-left p-3">Date</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {reviews.map((review) => (
            <tr key={review.id} className="border-b">
              <td className="p-3 font-mono text-xs">#{review.id}</td>
              <td className="p-3">
                {review.productName || "Unknown Product"}
              </td>
              <td className="p-3">
                {review.authorName || review.authorEmail || "Anonymous"}
              </td>
              <td className="p-3">{renderStars(review.rating || 0)}</td>
              <td className="p-3 max-w-xs truncate">
                {review.comment || "No comment"}
              </td>
              <td className="p-3">
                {new Date(review.createdAt).toLocaleDateString()}
              </td>
              <td className="p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteReviewId(review.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Reviews - Gold Coast Admin</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Reviews Management</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg border overflow-hidden">
          {reviewsContent}
        </div>
      </div>

      <AlertDialog
        open={!!deleteReviewId}
        onOpenChange={() => setDeleteReviewId(null)}
      >
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
    </AdminLayout>
  );
}

export default ReviewsManager;