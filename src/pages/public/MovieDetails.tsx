import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { ENDPOINTS } from "../../api/endpoints";
import type { Movie, Show, Theatre, ApiResponse } from "../../types";
import { TheatreShows } from "../../components/movies/TheatreShows";
import toast from "react-hot-toast";
import { MovieReviews } from "../../components/movies/MovieReviews";

export const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showsMap, setShowsMap] = useState<
    Map<string, { theatre: Theatre; shows: Show[] }>
  >(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [movieRes, showsRes] = await Promise.all([
          axiosClient.get<ApiResponse<Movie>>(ENDPOINTS.MOVIES.GET_BY_ID(id)),
          axiosClient.get<ApiResponse<Show[]>>(
            ENDPOINTS.SHOWS.GET_SHOWS_BY_MOVIE(id),
          ),
        ]);

        if (movieRes.data.data) {
          setMovie(movieRes.data.data);
        }

        const shows = showsRes.data.data || [];
        const grouped = new Map<string, { theatre: Theatre; shows: Show[] }>();

        shows.forEach((show) => {
          if (!grouped.has(show.theatreId)) {
            grouped.set(show.theatreId, {
              theatre: {
                id: show.theatreId,
                name: `Theatre ${show.theatreId.substring(0, 6).toUpperCase()}`,
                locationId: "Unknown",
                totalSeats: show.totalSeats,
              },
              shows: [],
            });
          }
          grouped.get(show.theatreId)!.shows.push(show);
        });

        setShowsMap(grouped);
      } catch (error) {
        toast.error("Failed to load movie details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading)
    return <div className="animate-pulse h-64 bg-brand-dark rounded-lg"></div>;
  if (!movie)
    return <div className="text-center text-white py-20">Movie not found.</div>;

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row gap-8 mb-12 bg-brand-dark p-8 rounded-xl border border-neutral-800">
        <img
          src={movie.posterUrl || movie.poster}
          alt={movie.title}
          className="w-64 rounded-lg shadow-2xl shadow-brand-crimson/20"
        />
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
          <div className="flex gap-4 text-neutral-400 mb-6 text-sm font-medium">
            <span className="bg-neutral-800 px-3 py-1 rounded-full">
              {movie.language}
            </span>
            <span className="bg-neutral-800 px-3 py-1 rounded-full">
              {movie.genre}
            </span>
            <span className="bg-neutral-800 px-3 py-1 rounded-full">
              {movie.durationMinutes} mins
            </span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 border-l-4 border-brand-crimson pl-3">
        Available Theatres
      </h2>

      {showsMap.size === 0 ? (
        <p className="text-neutral-500 bg-brand-dark p-6 rounded-lg text-center">
          No shows available for this movie currently.
        </p>
      ) : (
        Array.from(showsMap.values()).map(({ theatre, shows }) => (
          <TheatreShows key={theatre.id} theatre={theatre} shows={shows} />
        ))
      )}

      <MovieReviews movieId={id as string} />
    </div>
  );
};
