import React, { useState, useMemo } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import type { Show, Theatre, ApiResponse, Booking } from "../../types";
import { Button } from "../../components/ui/Button";
import { generateSeatGrid } from "../../utils/seatLayout";
import axiosClient from "../../api/axiosClient";
import { ENDPOINTS } from "../../api/endpoints";
import { decodeJWT } from "../../utils/jwt";
import toast from "react-hot-toast";

export const SeatSelection: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token } = useSelector((store: RootState) => store.auth);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  const show = state?.show as Show;
  const theatre = state?.theatre as Theatre;

  const seatGrid = useMemo(() => {
    return show ? generateSeatGrid(show.totalSeats) : [];
  }, [show]);

  if (!show || !theatre) {
    return <Navigate to="/" replace />;
  }

  const handleSeatToggle = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  };

  const handleBookTickets = async () => {
    if (selectedSeats.length === 0)
      return toast.error("Please select at least one seat");

    if (!token) return toast.error("User context lost. Please re-login.");

    const decodedToken: any = decodeJWT(token);
    const userId = decodedToken?.userId || decodedToken?.sub;

    console.log("Decoded Token:", decodedToken);
    console.log("Extracted User ID:", userId);
    if (!userId) {
      return toast.error("Could not extract user ID from session.");
    }

    setIsBooking(true);
    try {
      const res = await axiosClient.post<ApiResponse<Booking>>(
        ENDPOINTS.BOOKINGS.CREATE(userId),
        {
          showId: show.showId,
          seatNumbers: selectedSeats,
        },
      );

      const bookingData = res.data.data;
      toast.success("Seats locked successfully!");

      // Proceed to payment gateway initiation
      const paymentRes = await axiosClient.post(
        ENDPOINTS.PAYMENT.CREATE_PAYMENT(bookingData.bookingId),
      );

      // Payment endpoint returns a string (redirect URL for PayPal)
      if (typeof paymentRes.data === "string") {
        window.location.href = paymentRes.data;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to book seats");
    } finally {
      setIsBooking(false);
    }
  };

  const totalAmount = selectedSeats.length * show.pricePerSeat;

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <div className="w-full bg-brand-dark p-6 rounded-lg mb-8 text-center border border-neutral-800">
        <h2 className="text-2xl font-bold text-white">{theatre.name}</h2>
        <p className="text-brand-gold mt-1">
          {new Date(show.showTime).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      {/* Screen Visualization */}
      <div className="w-full flex justify-center mb-12">
        <div className="w-3/4 h-12 border-t-[8px] border-neutral-600 rounded-[50%] shadow-[0_-15px_30px_rgba(255,255,255,0.1)] opacity-70 flex justify-center pt-2">
          <span className="text-xs tracking-[0.3em] text-neutral-500 font-semibold uppercase">
            All eyes this way
          </span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="flex flex-col gap-3 mb-12 w-full items-center overflow-x-auto pb-4">
        {seatGrid.map((row) => (
          <div key={row.rowLabel} className="flex items-center gap-4">
            <span className="text-neutral-500 font-bold w-6 text-right text-sm">
              {row.rowLabel}
            </span>
            <div className="flex gap-2">
              {row.seats.map((seat) => {
                const isSelected = selectedSeats.includes(seat);
                return (
                  <button
                    key={seat}
                    onClick={() => handleSeatToggle(seat)}
                    className={`w-8 h-8 rounded-t-lg border transition-all text-xs font-semibold
                      ${
                        isSelected
                          ? "bg-brand-crimson border-brand-crimson text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                          : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-brand-crimson hover:text-white"
                      }`}
                  >
                    {seat.replace(/[A-Z]/, "")}
                  </button>
                );
              })}
            </div>
            <span className="text-neutral-500 font-bold w-6 text-left text-sm">
              {row.rowLabel}
            </span>
          </div>
        ))}
      </div>

      {/* Footer / Action Bar */}
      <div className="w-full bg-brand-dark p-6 rounded-lg border border-neutral-800 flex justify-between items-center sticky bottom-6 shadow-2xl">
        <div>
          <p className="text-sm text-neutral-400 mb-1">
            {selectedSeats.length} Seats Selected
          </p>
          <p className="text-2xl font-bold text-white">
            ${totalAmount.toFixed(2)}
          </p>
        </div>
        <Button
          onClick={handleBookTickets}
          disabled={selectedSeats.length === 0}
          isLoading={isBooking}
          className="px-8 py-3 text-lg"
        >
          Proceed to Pay
        </Button>
      </div>
    </div>
  );
};
