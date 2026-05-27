import React, { useState } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import axiosClient from "../../api/axiosClient";
import { ENDPOINTS } from "../../api/endpoints";
import type { Booking, ApiResponse } from "../../types";
import toast from "react-hot-toast";

export const FindBooking: React.FC = () => {
  const [bookingId, setBookingId] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId.trim()) return;

    setIsLoading(true);
    setBooking(null);
    try {
      const response = await axiosClient.get<ApiResponse<Booking>>(
        ENDPOINTS.BOOKINGS.GET_BY_ID(bookingId),
      );
      if (response.data.data) {
        setBooking(response.data.data);
      } else {
        toast.error("Booking not found");
      }
    } catch (error) {
      toast.error("Failed to retrieve booking");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">Find Your Booking</h2>

      <form onSubmit={handleSearch} className="flex gap-4 mb-8">
        <div className="grow">
          <Input
            label="Booking Reference ID"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            placeholder="e.g. 1042"
          />
        </div>
        <div className="pt-6">
          <Button type="submit" isLoading={isLoading}>
            Search
          </Button>
        </div>
      </form>

      {booking && (
        <div className="bg-brand-dark border border-brand-crimson/50 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-brand-crimson text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            {booking.status || "CONFIRMED"}
          </div>
          <h3 className="text-xl font-bold text-brand-gold mb-4">
            Ticket Confirmed
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-neutral-500">Booking ID</p>
              <p className="font-medium text-white">{booking.bookingId}</p>
            </div>
            <div>
              <p className="text-neutral-500">Amount Paid</p>
              <p className="font-medium text-white">
                ${booking.totalAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-neutral-500">Movie ID</p>
              <p className="font-medium text-white">{booking.movieId}</p>
            </div>
            <div>
              <p className="text-neutral-500">Seats</p>
              <p className="font-medium text-white">
                {booking.seatNumbers.join(", ")}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-800 flex justify-between items-center">
            <span className="text-xs text-neutral-500">
              Booked at: {new Date(booking.bookedAt).toLocaleString()}
            </span>
            <div className="w-16 h-16 bg-white p-1 rounded">
              <div className="w-full h-full border-4 border-black border-dashed opacity-50"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
