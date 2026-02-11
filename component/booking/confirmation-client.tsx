"use client";

import { useMovieById } from "../../lib/hooks/useMovie";
import { useShowtimeDetails } from "../../lib/hooks/useShowtimes";
// @/lib/hooks/use-showtimes
import { useSeatsByShowtime } from "../../lib/hooks/useSeats";
import { useState } from "react";
import { Skeleton } from "../../component/skeleton";
import { Button } from "../../component/ui/button";
import { Card } from "../../component/ui/card";
import { Badge } from "../../component/ui/badge";
import Link from "next/link";
import { CheckCircle2, Printer, Share2, Home } from "lucide-react";
import { motion } from "framer-motion";

interface ConfirmationClientProps {
  showtimeId: string;
  seatIds: string[];
}

export function ConfirmationClient({
  showtimeId,
  seatIds,
}: ConfirmationClientProps) {
  const [bookingId] = useState(() => `BK${Date.now().toString().slice(-8)}`);
  const { data: showtimeData, isLoading: showtimeLoading } =
    useShowtimeDetails(showtimeId);

  const { data: allSeats = [], isLoading: seatsLoading } =
    useSeatsByShowtime(showtimeId);
  const { data: movie, isLoading: movieLoading } = useMovieById(
    showtimeData?.showtime.movieId,
  );

  const selectedSeats = allSeats.filter((seat) => seatIds.includes(seat.id));
  const totalPrice =
    selectedSeats.length * (showtimeData?.showtime.pricePerSeat || 0);

  const isLoading = showtimeLoading || seatsLoading || movieLoading;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Skeleton className="h-12 w-32 mx-auto mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!showtimeData || !movie) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Error loading booking details
        </h2>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  const startDate = new Date(showtimeData.showtime.startTime);
  const endDate = new Date(showtimeData.showtime.endTime);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-2xl px-4 py-12"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="flex justify-center mb-8"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
          <CheckCircle2 className="h-20 w-20 text-green-500 relative" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-4xl font-bold text-foreground text-center mb-3"
      >
        Booking Confirmed!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-lg text-muted-foreground text-center mb-8"
      >
        Your movie tickets have been successfully reserved
      </motion.p>

      {/* Booking Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-8 mb-8 border-border">
          {/* Booking Number */}
          <div className="text-center pb-6 border-b border-border mb-6">
            <p className="text-sm text-muted-foreground mb-1">
              Booking Reference
            </p>
            <p className="text-3xl font-bold text-accent font-mono">
              {bookingId}
            </p>
          </div>

          {/* Movie Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                Movie
              </h3>
              <p className="text-xl font-bold text-foreground">{movie.title}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {movie.genre.map((g) => (
                  <Badge key={g} variant="secondary" className="text-xs">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                  Theater
                </h3>
                <p className="font-bold text-foreground">
                  {showtimeData.theaterName}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                  Date
                </h3>
                <p className="font-bold text-foreground">
                  {startDate.toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                  Show Time
                </h3>
                <p className="font-bold text-foreground">
                  {startDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                  Duration
                </h3>
                <p className="font-bold text-foreground">
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Selected Seats
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {selectedSeats
                  .sort(
                    (a, b) =>
                      a.row.localeCompare(b.row) || a.seatNumber - b.seatNumber,
                  )
                  .map((seat) => (
                    <div
                      key={seat.id}
                      className="bg-accent/10 border border-accent rounded-md px-3 py-2 text-center"
                    >
                      <p className="font-bold text-foreground">
                        {seat.row}
                        {seat.seatNumber}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="pt-6 border-t border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">
                  {selectedSeats.length} seat
                  {selectedSeats.length !== 1 ? "s" : ""} @ $
                  {showtimeData.showtime.pricePerSeat}
                </span>
                <span className="font-bold text-foreground">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="font-bold text-lg text-foreground">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-accent">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4 text-center">
              <p className="text-sm font-semibold text-green-600">
                ✓ Payment Completed
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Button
          variant="outline"
          className="gap-2 flex-1 bg-transparent"
          onClick={() => window.print()}
        >
          <Printer className="h-4 w-4" />
          Print Ticket
        </Button>
        <Button
          variant="outline"
          className="gap-2 flex-1 bg-transparent"
          onClick={() => {
            // Share functionality
            if (navigator.share) {
              navigator.share({
                title: "Movie Booking Confirmed",
                text: `I booked ${movie.title} - Reference: ${bookingId}`,
              });
            }
          }}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </motion.div>

      {/* Navigation Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex flex-col gap-3 mt-6"
      >
        <Link href="/profile">
          <Button variant="default" className="w-full">
            View My Bookings
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="w-full gap-2 bg-transparent">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
