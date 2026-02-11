"use client";

import { useState } from "react";
import { useSeatsByShowtime } from "../../lib/hooks/useSeats";
import { useShowtimeDetails } from "../../lib/hooks/useShowtimes";
import { useMovieById } from "../../lib/hooks/useMovie";
// @/lib/hooks/use-movies
import { Skeleton } from "../../component/skeleton";
import { Button } from "../../component/ui/button";
import { Card } from "../../component/ui/card";
import { SeatMap } from "./seat-map";
import type { Seat } from "../../types/seat";
import Link from "next/link";
import { ArrowLeft, Armchair, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";
import api from "../../lib/api";

interface SeatSelectionClientProps {
  showtimeId: string;
}

export function SeatSelectionClient({ showtimeId }: SeatSelectionClientProps) {
  const router = useRouter();

  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const { data: showtimeData, isLoading: showtimeLoading } =
    useShowtimeDetails(showtimeId);
  const { data: allSeats = [], isLoading: seatsLoading } =
    useSeatsByShowtime(showtimeId);
  const { data: movie } = useMovieById(showtimeData?.showtime.movieId);

  const handleSeatToggle = (seat: Seat) => {
    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.id === seat.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const handleConfirmBooking = async () => {
    if (!showtimeData || selectedSeats.length === 0) return;

    try {
      const response = await api.booking.createBooking({
        showtimeId,
        theaterId: showtimeData.showtime.theaterId, // adjust if needed
        seats: selectedSeats.map((s) => s.id),
        totalPrice,
      });

      if (response.success) {
        router.push(
          `/confirmation/${showtimeId}?seats=${selectedSeats
            .map((s) => s.id)
            .join(",")}`,
        );
      }
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    }
  };

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + (showtimeData?.showtime.pricePerSeat || 0),
    0,
  );

  if (showtimeLoading || seatsLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!showtimeData) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Showtime not found
        </h2>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  const { showtime, theaterName } = showtimeData;
  const startDate = new Date(showtime.startTime);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-6xl px-4 py-12"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href={`/movie/${showtimeData.showtime.movieId}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">
          Select Your Seats
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seat Map */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-card rounded-lg p-8 border border-border">
            <SeatMap
              seats={allSeats}
              selectedSeats={selectedSeats}
              onSeatToggle={handleSeatToggle}
            />
          </div>
        </motion.div>

        {/* Summary Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:row-span-2"
        >
          <Card className="p-6 sticky top-24 border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Booking Summary
            </h2>

            {/* Movie Info */}
            {movie && (
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <p className="font-semibold text-foreground">{movie.title}</p>
                <p className="text-sm text-muted-foreground">{theaterName}</p>
                <p className="text-sm text-muted-foreground">
                  {startDate.toLocaleDateString()} at{" "}
                  {startDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}

            {/* Selected Seats */}
            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <Armchair className="h-5 w-5 text-accent" />
                <p className="font-semibold text-foreground">Selected Seats</p>
              </div>
              {selectedSeats.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No seats selected
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {selectedSeats
                    .sort(
                      (a, b) =>
                        a.row.localeCompare(b.row) ||
                        a.seatNumber - b.seatNumber,
                    )
                    .map((seat) => (
                      <div
                        key={seat.id}
                        className="text-sm font-semibold text-foreground bg-accent/10 rounded px-2 py-1 flex items-center justify-between"
                      >
                        <span>
                          {seat.row}
                          {seat.seatNumber}
                        </span>
                        <span
                          className="cursor-pointer text-xs ml-1"
                          onClick={() => handleSeatToggle(seat)}
                        >
                          ✕
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  {selectedSeats.length} seat
                  {selectedSeats.length !== 1 ? "s" : ""}
                </span>
                <span className="text-foreground">
                  @ ${showtime.pricePerSeat}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-accent flex items-center gap-1">
                  <DollarSign className="h-5 w-5" />
                  {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href={`/movie/${showtimeData.showtime.movieId}`}
                className="block"
              >
                <Button variant="outline" className="w-full bg-transparent">
                  Cancel
                </Button>
              </Link>
              {/* <Link
                href={
                  selectedSeats.length > 0
                    ? `/confirmation/${showtimeId}?seats=${selectedSeats
                        .map((s) => s.id)
                        .join(",")}`
                    : "#"
                }
                className="block"
              >
                <Button
                  className="w-full"
                  disabled={selectedSeats.length === 0}
                >
                  Confirm & Continue
                </Button>
              </Link> */}
              <Button
                className="w-full"
                disabled={selectedSeats.length === 0}
                onClick={handleConfirmBooking}
              >
                Confirm & Continue
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
