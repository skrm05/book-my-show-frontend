import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Button } from "../../components/ui/Button";
import axiosClient from "../../api/axiosClient";
import { ENDPOINTS } from "../../api/endpoints";
import { UserRole } from "../../types";
import type { Movie, Theatre, ApiResponse } from "../../types";
import toast from "react-hot-toast";

type Tab = "movies" | "theatres";

export const ManageEntities: React.FC = () => {
  const { role, username } = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState<Tab>("movies");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "movies") {
        const res = await axiosClient.get<ApiResponse<Movie[]>>(
          ENDPOINTS.MOVIES.GET_ALL,
        );
        setMovies(res.data?.data?.filter((m) => !m.deleted) || []);
      } else {
        const res = await axiosClient.get<ApiResponse<Theatre[]>>(
          ENDPOINTS.THEATRE.GET_ALL_THEATRES,
        );
        setTheatres(res.data?.data || []);
      }
    } catch (error) {
      toast.error(`Failed to load ${activeTab}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this record? This cannot be undone.",
      )
    )
      return;

    try {
      if (activeTab === "movies") {
        await axiosClient.delete(ENDPOINTS.MOVIES.DELETE_BY_ID(id));
        setMovies((prev) => prev.filter((m) => m.id !== id));
      } else {
        await axiosClient.delete(ENDPOINTS.THEATRE.DELETE_THEATRE_BY_ID(id));
        setTheatres((prev) => prev.filter((t) => t.id !== id));
      }
      toast.success("Record deleted successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete record");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 animate-fadeIn">
      <h2 className="text-3xl font-bold mb-6">Manage Data</h2>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 mb-6">
        <button
          className={`px-6 py-3 font-medium transition-colors ${activeTab === "movies" ? "text-brand-crimson border-b-2 border-brand-crimson" : "text-neutral-500 hover:text-white"}`}
          onClick={() => setActiveTab("movies")}
        >
          Movies
        </button>
        <button
          className={`px-6 py-3 font-medium transition-colors ${activeTab === "theatres" ? "text-brand-crimson border-b-2 border-brand-crimson" : "text-neutral-500 hover:text-white"}`}
          onClick={() => setActiveTab("theatres")}
        >
          Theatres
        </button>
      </div>

      {/* Data Grid */}
      <div className="bg-brand-dark rounded-lg border border-neutral-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-neutral-500 animate-pulse">
            Loading records...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="bg-neutral-900/50 text-neutral-400 font-medium">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name / Title</th>
                  <th className="px-6 py-4">
                    {activeTab === "movies" ? "Genre" : "Capacity"}
                  </th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {activeTab === "movies" && movies.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center">
                      No movies found.
                    </td>
                  </tr>
                )}
                {activeTab === "theatres" && theatres.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center">
                      No theatres found.
                    </td>
                  </tr>
                )}

                {activeTab === "movies"
                  ? movies.map((movie) => {
                      const isCreator =
                        (movie as any).createdBy === username ||
                        (movie as any).theatreId === username;

                      const canDeleteMovie =
                        role === UserRole.SUPER_ADMIN ||
                        (role === UserRole.THEATRE_ADMIN && isCreator);

                      return (
                        <tr
                          key={movie.id}
                          className="hover:bg-neutral-900/30 transition-colors"
                        >
                          <td className="px-6 py-4 font-mono text-xs">
                            {movie.id.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 font-bold text-white">
                            {movie.title}
                          </td>
                          <td className="px-6 py-4">{movie.genre}</td>
                          <td className="px-6 py-4 text-right">
                            {canDeleteMovie ? (
                              <Button
                                variant="danger"
                                className="py-1 px-3 text-xs"
                                onClick={() => handleDelete(movie.id)}
                              >
                                Delete
                              </Button>
                            ) : (
                              <span className="text-xs text-neutral-600 font-semibold uppercase tracking-wider">
                                No Access
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  : theatres.map((theatre) => {
                      const canDeleteTheatre =
                        role === UserRole.SUPER_ADMIN ||
                        (role === UserRole.THEATRE_ADMIN &&
                          theatre.id === username);

                      return (
                        <tr
                          key={theatre.id}
                          className="hover:bg-neutral-900/30 transition-colors"
                        >
                          <td className="px-6 py-4 font-mono text-xs">
                            {theatre.id.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 font-bold text-white">
                            {theatre.name}
                          </td>
                          <td className="px-6 py-4">
                            {theatre.totalSeats} Seats
                          </td>
                          <td className="px-6 py-4 text-right">
                            {canDeleteTheatre ? (
                              <Button
                                variant="danger"
                                className="py-1 px-3 text-xs"
                                onClick={() => handleDelete(theatre.id)}
                              >
                                Delete
                              </Button>
                            ) : (
                              <span className="text-xs text-neutral-600 font-semibold uppercase tracking-wider">
                                No Access
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
