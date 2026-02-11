"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "../../component/ui/card";
import { Button } from "../../component/ui/button";
import { Badge } from "../../component/ui/badge";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../component/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "../../component/ui/alert-dialog";
import type { Booking } from "../../types/booking";
import type { Movie } from "../../types/movie";
import type { Theater } from "../../types/theater";
import api from "../../lib/api";
import {
  Ticket,
  Calendar,
  MapPin,
  Users,
  Trash2,
  ChevronRight,
  Home,
} from "lucide-react";
import { motion } from "framer-motion";

export function ProfileClient() {
  const queryClient = useQueryClient();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // --- API Data Fetching ---
  const { data: bookingsRes } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => api.booking.getUserBookings(),
  });

  const { data: movies } = useQuery({
    queryKey: ["movies"],
    queryFn: () => api.movies.getAll(),
  });

  const { data: theaters } = useQuery({
    queryKey: ["theaters"],
    queryFn: () => api.theaters.getAll(),
  });

  // --- Cancel Mutation ---
  const cancelMutation = useMutation({
    mutationFn: (id: string) => api.booking.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setCancellingId(null);
    },
  });

  // --- Data Extraction ---
  // Map _id to id to avoid TS errors
  const bookings = ((bookingsRes?.data as Booking[]) || []).map((b) => ({
    ...b,
    id: b._id,
    bookingDate: b.bookingDate || new Date().toISOString(), // fallback for invalid date
    theaterId: b.theaterId,
  }));

  const getMovieDetails = (movieId: string) => {
    if (!movies) return undefined;
    return (movies as Movie[]).find((m) => m._id === movieId);
  };

  const getTheaterName = (theaterId?: string) => {
    if (!theaterId) return "Unknown Theater";
    const theater = (theaters as Theater[])?.find((t) => t._id === theaterId);
    return theater?.name || "Unknown Theater";
  };

  // Original Logic for filtering
  const upcomingBookings = bookings
    .filter((b) => b.status !== "cancelled")
    .sort(
      (a, b) =>
        new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime(),
    );

  const pastBookings = bookings
    .filter((b) => b.status === "cancelled")
    .sort(
      (a, b) =>
        new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime(),
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-4xl px-4 py-12"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-foreground mb-2">My Bookings</h1>
        <p className="text-muted-foreground">Manage your movie reservations</p>
      </motion.div>

      {bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-12 text-center border-border">
            <Ticket className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No bookings yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start booking your favorite movies now!
            </p>
            <Link href="/">
              <Button>Browse Movies</Button>
            </Link>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastBookings.length})
              </TabsTrigger>
            </TabsList>

            {/* Upcoming Bookings */}
            <TabsContent value="upcoming" className="space-y-4">
              {upcomingBookings.length === 0 ? (
                <Card className="p-8 text-center border-border">
                  <p className="text-muted-foreground">
                    No upcoming bookings. Book a movie now!
                  </p>
                </Card>
              ) : (
                upcomingBookings.map((booking, index) => {
                  const movie = getMovieDetails(booking.movieId);
                  if (!movie) return null;

                  const startDate = new Date(booking.bookingDate);
                  const isActive = booking.status === "confirmed";

                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow border-border">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-4">
                              <Ticket className="h-5 w-5 text-accent mt-1 shrink-0" />
                              <div>
                                <h3 className="text-lg font-bold text-foreground">
                                  {movie.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Reference: {booking.id}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground text-xs">
                                  <MapPin className="h-3 w-3 inline mr-1" />
                                  Theater
                                </p>
                                <p className="font-semibold text-foreground">
                                  {getTheaterName(booking.theaterId)}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">
                                  <Calendar className="h-3 w-3 inline mr-1" />
                                  Date
                                </p>
                                <p className="font-semibold text-foreground">
                                  {startDate.toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">
                                  <Ticket className="h-3 w-3 inline mr-1" />
                                  Time
                                </p>
                                <p className="font-semibold text-foreground">
                                  {startDate.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">
                                  <Users className="h-3 w-3 inline mr-1" />
                                  Seats
                                </p>
                                <p className="font-semibold text-foreground">
                                  {booking.seats.join(", ")}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 md:ml-4">
                            <Badge
                              className={
                                isActive ? "bg-green-500/20 text-green-600" : ""
                              }
                            >
                              {isActive ? "Active" : "Confirmed"}
                            </Badge>
                            <p className="text-lg font-bold text-accent">
                              ${booking.totalPrice.toFixed(2)}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 text-destructive hover:text-destructive bg-transparent"
                              onClick={() => setCancellingId(booking.id)}
                              disabled={booking.status === "cancelled"}
                            >
                              <Trash2 className="h-4 w-4" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </TabsContent>

            {/* Past Bookings */}
            <TabsContent value="past" className="space-y-4">
              {pastBookings.length === 0 ? (
                <Card className="p-8 text-center border-border">
                  <p className="text-muted-foreground">No past bookings yet.</p>
                </Card>
              ) : (
                pastBookings.map((booking, index) => {
                  const movie = getMovieDetails(booking.movieId);
                  if (!movie) return null;

                  const startDate = new Date(booking.bookingDate);

                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="p-6 border-border opacity-75">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground mb-2">
                              {movie.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {startDate.toLocaleDateString()} at{" "}
                              {startDate.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Cancelled • Reference: {booking.id}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 md:ml-4">
                            <Badge variant="secondary">Cancelled</Badge>
                            <Link
                              href={`/movie/${booking.movieId}`}
                              className="block"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full gap-2 bg-transparent"
                              >
                                Book Again
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      )}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog
        open={!!cancellingId}
        onOpenChange={() => setCancellingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this booking? You will receive a
            refund to your original payment method.
          </AlertDialogDescription>
          <div className="flex gap-3">
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                cancellingId && cancelMutation.mutate(cancellingId)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Booking
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
