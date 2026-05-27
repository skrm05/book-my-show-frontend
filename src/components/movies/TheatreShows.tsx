import React from "react";
import { useNavigate } from "react-router-dom";
import type { Show, Theatre } from "../../types";

interface Props {
  theatre: Theatre;
  shows: Show[];
}

export const TheatreShows: React.FC<Props> = ({ theatre, shows }) => {
  const navigate = useNavigate();

  const handleShowClick = (show: Show) => {
    // Pass show data via state so SeatSelection doesn't need to re-fetch
    navigate(`/book/${show.showId}`, { state: { show, theatre } });
  };

  return (
    <div className="bg-brand-dark p-6 rounded-lg border border-neutral-800 mb-4 flex flex-col md:flex-row md:items-center gap-6">
      <div className="md:w-1/3">
        <h3 className="text-xl font-bold text-white mb-1">{theatre.name}</h3>
        <p className="text-sm text-neutral-400">
          Total Seats: {theatre.totalSeats}
        </p>
      </div>
      <div className="md:w-2/3 flex flex-wrap gap-3">
        {shows.map((show) => {
          const time = new Date(show.showTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          return (
            <button
              key={show.showId}
              onClick={() => handleShowClick(show)}
              className="px-4 py-2 border border-brand-crimson text-brand-crimson rounded hover:bg-brand-crimson hover:text-white transition-colors text-sm font-medium"
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
};
