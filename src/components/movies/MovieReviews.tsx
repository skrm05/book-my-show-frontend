import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Button } from "../ui/Button";
import axiosClient from "../../api/axiosClient";
import { ENDPOINTS } from "../../api/endpoints";
import { UserRole, type Review, type ApiResponse } from "../../types";
import toast from "react-hot-toast";
import { decodeJWT } from "../../utils/jwt";

interface Props {
  movieId: string;
}

export const MovieReviews: React.FC<Props> = ({ movieId }) => {
  const { isAuthenticated, role, token, username } = useSelector(
    (state: RootState) => state.auth,
  );

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosClient.get<ApiResponse<Review[]>>(
          ENDPOINTS.REVIEWS.GET_REVIEWS_BY_MOVIE(movieId),
        );
        setReviews(res.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [movieId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error("Review comment cannot be empty");

    // Extract precise userId from token
    const decodedToken: any = token ? decodeJWT(token) : null;
    const userId = decodedToken?.userId || decodedToken?.sub || username;

    setIsSubmitting(true);
    try {
      const res = await axiosClient.post<ApiResponse<Review>>(
        ENDPOINTS.REVIEWS.POST_REVIEW,
        {
          userId,
          movieId,
          rating,
          comment,
        },
      );

      toast.success("Review posted successfully!");
      setReviews([res.data.data, ...reviews]);
      setComment("");
      setRating(5);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to post review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 pt-12 border-t border-neutral-800">
      <h2 className="text-2xl font-bold mb-8 border-l-4 border-brand-gold pl-3">
        Audience Reviews
      </h2>

      {isAuthenticated && role === UserRole.USER && (
        <form
          onSubmit={handleSubmit}
          className="mb-10 bg-neutral-900/50 p-6 rounded-lg border border-neutral-800"
        >
          <h3 className="text-lg font-semibold mb-4 text-white">
            Write a Review
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm text-neutral-400">Rating:</label>
            <select
              className="bg-brand-dark border border-neutral-700 text-brand-gold font-bold p-2 rounded outline-none focus:border-brand-crimson"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>
                  {num} Stars
                </option>
              ))}
            </select>
          </div>
          <textarea
            className="w-full bg-brand-dark border border-neutral-700 text-white rounded p-4 mb-4 outline-none focus:border-brand-crimson resize-none"
            rows={3}
            placeholder="What did you think of the movie?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end">
            <Button type="submit" isLoading={isSubmitting}>
              Post Review
            </Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="animate-pulse h-32 bg-brand-dark rounded-lg"></div>
      ) : reviews.length === 0 ? (
        <p className="text-neutral-500 bg-brand-dark p-6 rounded-lg text-center">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="grid gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.reviewId}
              className="bg-brand-dark p-6 rounded-lg border border-neutral-800"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="font-semibold text-white">
                  User {rev.userId.substring(0, 8)}...
                </span>
                <span className="bg-brand-gold/20 text-brand-gold text-xs font-bold px-2 py-1 rounded">
                  {rev.rating} / 5
                </span>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed">
                {rev.comment}
              </p>
              <p className="text-xs text-neutral-600 mt-4">
                {new Date(rev.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
