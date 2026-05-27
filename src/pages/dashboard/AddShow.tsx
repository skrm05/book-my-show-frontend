import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import axiosClient from "../../api/axiosClient";
import { ENDPOINTS } from "../../api/endpoints";
import { UserRole } from "../../types";
import type { Movie, Theatre, ApiResponse } from "../../types";
import toast from "react-hot-toast";

export const AddShow: React.FC = () => {
  const navigate = useNavigate();
  // Extract role and username to auto-assign the theatre for Theatre Admins
  const { role, username } = useSelector((state: RootState) => state.auth);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState({
    movieId: "",
    theatreId: "",
    showTime: "",
    totalSeats: "",
    pricePerSeat: "",
  });

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [movRes, theaRes] = await Promise.all([
          axiosClient.get<ApiResponse<Movie[]>>(ENDPOINTS.MOVIES.GET_ALL),
          axiosClient.get<ApiResponse<Theatre[]>>(
            ENDPOINTS.THEATRE.GET_ALL_THEATRES,
          ),
        ]);
        setMovies(movRes.data.data.filter((m) => !m.deleted));
        setTheatres(theaRes.data.data);
      } catch (err) {
        toast.error("Failed to load movies or theatres.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchDependencies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Determine the final theatreId to send based on the user's role
    const finalTheatreId =
      role === UserRole.THEATRE_ADMIN ? username || "" : formData.theatreId;

    if (
      !formData.movieId ||
      !finalTheatreId ||
      !formData.showTime ||
      !formData.totalSeats ||
      !formData.pricePerSeat
    ) {
      return toast.error("Please fill all required fields.");
    }

    setIsLoading(true);
    try {
      await axiosClient.post(ENDPOINTS.SHOWS.POST_SHOWS, {
        movieId: formData.movieId,
        theatreId: finalTheatreId, // Use the dynamically resolved ID
        showTime: new Date(formData.showTime).toISOString(),
        totalSeats: parseInt(formData.totalSeats),
        pricePerSeat: parseFloat(formData.pricePerSeat),
      });
      toast.success("Show scheduled successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to schedule show.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching)
    return (
      <div className="animate-pulse h-64 bg-brand-dark rounded-lg mt-6"></div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-6 animate-fadeIn">
      <h2 className="text-3xl font-bold mb-6">Schedule New Show</h2>
      <div className="bg-brand-dark p-8 rounded-lg border border-neutral-800">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col mb-2">
            <label className="mb-1 text-sm text-neutral-300 font-medium">
              Select Movie *
            </label>
            <select
              className="px-4 py-3 rounded bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-brand-crimson"
              value={formData.movieId}
              onChange={(e) =>
                setFormData({ ...formData, movieId: e.target.value })
              }
            >
              <option value="">-- Choose a Movie --</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Only render the Theatre selector if the user is a Super Admin */}
          {role === UserRole.SUPER_ADMIN && (
            <div className="flex flex-col mb-2">
              <label className="mb-1 text-sm text-neutral-300 font-medium">
                Select Theatre *
              </label>
              <select
                className="px-4 py-3 rounded bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-brand-crimson"
                value={formData.theatreId}
                onChange={(e) =>
                  setFormData({ ...formData, theatreId: e.target.value })
                }
              >
                <option value="">-- Choose a Theatre --</option>
                {theatres.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (Capacity: {t.totalSeats})
                  </option>
                ))}
              </select>
            </div>
          )}

          <Input
            label="Show Date & Time *"
            type="datetime-local"
            value={formData.showTime}
            onChange={(e) =>
              setFormData({ ...formData, showTime: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Allocated Seats *"
              type="number"
              min="1"
              value={formData.totalSeats}
              onChange={(e) =>
                setFormData({ ...formData, totalSeats: e.target.value })
              }
            />
            <Input
              label="Price Per Seat ($) *"
              type="number"
              step="0.01"
              min="0"
              value={formData.pricePerSeat}
              onChange={(e) =>
                setFormData({ ...formData, pricePerSeat: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Schedule Show
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
