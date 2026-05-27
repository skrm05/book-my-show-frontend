import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { ENDPOINTS } from "../../api/endpoints";
import type { Movie, ApiResponse } from "../../types";
import { usePaymentHandler } from "../../hooks/usePaymentHandler";
import toast from "react-hot-toast";

export const Home: React.FC = () => {
  // Listen for PayPal redirects
  usePaymentHandler();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axiosClient.get<ApiResponse<Movie[]>>(
          ENDPOINTS.MOVIES.GET_ALL,
        );
        if (!response.data.error) {
          setMovies(response.data.data.filter((m) => !m.deleted));
        }
      } catch (error) {
        toast.error("Failed to load movies.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-crimson"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-bold">Movies</h1>
      </div>

      {movies.length === 0 ? (
        <div className="text-center text-neutral-500 py-20 bg-brand-dark rounded-lg border border-neutral-800">
          No movies available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="group relative block transition-transform duration-300 hover:scale-105"
            >
              <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-neutral-800 border border-neutral-800 group-hover:border-brand-crimson/50 transition-colors">
                <img
                  src={movie.posterUrl || movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-brand-crimson font-semibold text-sm uppercase tracking-wider bg-black/50 w-fit px-2 py-1 rounded border border-brand-crimson/30">
                    Book Now
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-lg font-semibold truncate group-hover:text-brand-crimson transition-colors">
                  {movie.title}
                </h3>
                <p className="text-sm text-neutral-400 truncate">
                  {movie.genre} • {movie.language}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
