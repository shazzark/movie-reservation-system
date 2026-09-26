"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Clock3, MapPin, Ticket, XCircle } from "lucide-react";
import { Card } from "../../component/ui/card";
import { Button } from "../../component/ui/button";
import { Badge } from "../../component/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../component/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "../../component/ui/alert-dialog";
import type { Booking } from "../../types/booking";
import type { Movie } from "../../types/movie";
import type { Theater } from "../../types/theater";
import api, { ApiRequestError } from "../../lib/api";

export function ProfileClient() {
  const queryClient = useQueryClient();
  const [cancelling, setCancelling] = useState<Booking | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const bookingsQuery = useQuery({ queryKey: ["bookings"], queryFn: api.booking.getUserBookings });
  const moviesQuery = useQuery<Movie[], Error>({ queryKey: ["movies"], queryFn: api.movies.getAll });
  const theatersQuery = useQuery<Theater[], Error>({ queryKey: ["theaters"], queryFn: api.theaters.getAll });

  const cancelMutation = useMutation({
    mutationFn: (booking: Booking) => api.booking.delete(booking._id),
    onSuccess: async (response) => {
      setCancelling(null);
      setCancelError(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["showtime", response.data?.showtimeId] }),
        queryClient.invalidateQueries({ queryKey: ["seats", response.data?.showtimeId] }),
        queryClient.invalidateQueries({ queryKey: ["showtimes"] }),
        queryClient.invalidateQueries({ queryKey: ["discovery-movies"] }),
      ]);
    },
    onError: (error) => {
      setCancelError(error instanceof ApiRequestError && error.status === 409
        ? error.message
        : error instanceof Error ? error.message : "The reservation could not be cancelled.");
      setCancelling(null);
    },
  });

  const bookings = bookingsQuery.data?.data ?? [];
  const movieById = useMemo(() => new Map((moviesQuery.data ?? []).map((movie) => [movie._id, movie])), [moviesQuery.data]);
  const theaterById = useMemo(() => new Map((theatersQuery.data ?? []).map((theater) => [theater._id, theater])), [theatersQuery.data]);
  const [now] = useState(() => Date.now());
  const cancelled = bookings.filter((booking) => booking.status === "cancelled").sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
  const upcoming = bookings.filter((booking) => booking.status !== "cancelled" && booking.showtimeStartTime && new Date(booking.showtimeStartTime).getTime() > now).sort((a, b) => new Date(a.showtimeStartTime!).getTime() - new Date(b.showtimeStartTime!).getTime());
  const past = bookings.filter((booking) => booking.status !== "cancelled" && (!booking.showtimeStartTime || new Date(booking.showtimeStartTime).getTime() <= now)).sort((a, b) => new Date(b.showtimeStartTime ?? b.bookingDate).getTime() - new Date(a.showtimeStartTime ?? a.bookingDate).getTime());

  const isLoading = bookingsQuery.isLoading || moviesQuery.isLoading || theatersQuery.isLoading;
  const loadError = bookingsQuery.error ?? moviesQuery.error ?? theatersQuery.error;
  const retry = () => void Promise.all([bookingsQuery.refetch(), moviesQuery.refetch(), theatersQuery.refetch()]);

  if (isLoading) return <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6 lg:px-8" role="status" aria-live="polite" aria-label="Loading reservation history"><div className="h-10 w-64 animate-pulse rounded-lg bg-muted" /><div className="h-36 animate-pulse rounded-3xl bg-muted" /><div className="h-52 animate-pulse rounded-3xl bg-muted" /></div>;
  if (loadError) return <div className="mx-auto max-w-2xl px-4 py-24 text-center" role="alert"><h1 className="text-3xl font-bold">Reservations could not load</h1><p className="mt-3 text-muted-foreground">{loadError.message}</p><Button className="mt-6" onClick={retry}>Try again</Button></div>;

  const renderBookings = (items: Booking[], emptyMessage: string, group: "upcoming" | "past" | "cancelled") => items.length === 0 ? (
    <Card className="border-border p-9 text-center"><Ticket className="mx-auto size-9 text-muted-foreground" aria-hidden="true" /><p className="mt-3 text-muted-foreground">{emptyMessage}</p>{group === "upcoming" && <Button asChild className="mt-5"><Link href="/movies">Browse movies</Link></Button>}</Card>
  ) : (
    <div className="space-y-4">
      {items.map((booking) => {
        const movie = movieById.get(booking.movieId);
        const theater = theaterById.get(booking.theaterId);
        const startsAt = booking.showtimeStartTime ? new Date(booking.showtimeStartTime) : null;
        const canCancel = booking.status === "confirmed" && startsAt !== null && startsAt.getTime() > now;
        const badgeText = booking.status === "cancelled" ? "Cancelled" : booking.status;
        return (
          <Card key={booking._id} className="overflow-hidden border-border p-4 sm:p-5">
            <div className="flex flex-col gap-5 sm:flex-row">
              {movie?.posterUrl && <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl border border-border bg-muted sm:aspect-[3/4] sm:w-24"><Image src={movie.posterUrl} alt={`${movie.title} poster`} fill sizes="(max-width: 640px) 100vw, 96px" className="object-cover" /></div>}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><h2 className="text-xl font-bold">{movie?.title ?? "Movie details unavailable"}</h2><p className="mt-1 break-all text-xs text-muted-foreground">Reservation {booking._id}</p></div>
                  <Badge variant={booking.status === "cancelled" ? "secondary" : "outline"} className="capitalize">{badgeText}</Badge>
                </div>
                <div className="mt-5 grid gap-x-5 gap-y-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
                  <div className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /><div><p className="text-xs text-muted-foreground">Theater</p><p className="mt-0.5 font-semibold">{theater?.name ?? "Theater unavailable"}</p>{theater?.location && <p className="text-xs text-muted-foreground">{theater.location}</p>}</div></div>
                  <div className="flex gap-2"><CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /><div><p className="text-xs text-muted-foreground">Showtime</p><p className="mt-0.5 font-semibold">{startsAt ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(startsAt) : "Unavailable"}</p></div></div>
                  <div className="flex gap-2"><Clock3 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /><div><p className="text-xs text-muted-foreground">Time</p><p className="mt-0.5 font-semibold">{startsAt ? new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(startsAt) : "Unavailable"}</p></div></div>
                  <div className="flex gap-2"><Ticket className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /><div><p className="text-xs text-muted-foreground">Seats</p><p className="mt-0.5 font-semibold">{booking.seats.join(", ")}</p></div></div>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground">Reservation total <span className="ml-2 text-lg font-bold text-foreground">${booking.totalPrice.toFixed(2)}</span></p>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm"><Link href={`/confirmation/${booking._id}`}>View reservation</Link></Button>
                    {canCancel && <Button variant="outline" size="sm" disabled={cancelMutation.isPending} onClick={() => { setCancelError(null); setCancelling(booking); }}><XCircle className="size-4" aria-hidden="true" /> Cancel reservation</Button>}
                    {group === "past" && <Button asChild variant="outline" size="sm"><Link href={`/movie/${booking.movieId}`}>View movie</Link></Button>}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Your account</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Reservation history</h1><p className="mt-3 text-muted-foreground">Review upcoming screenings, past visits, and cancelled reservations.</p></div>
      {cancelError && <div role="alert" className="mb-5 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">{cancelError}</div>}
      {bookings.length === 0 ? <Card className="border-border p-10 text-center"><Ticket className="mx-auto size-10 text-muted-foreground" aria-hidden="true" /><h2 className="mt-4 text-2xl font-bold">No reservations yet</h2><p className="mt-2 text-muted-foreground">Choose a movie and screening to make your first reservation.</p><Button asChild className="mt-6"><Link href="/movies">Browse movies</Link></Button></Card> : (
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6 grid w-full grid-cols-3 sm:w-fit sm:min-w-[420px]">
            <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelled.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-4">{renderBookings(upcoming, "No upcoming screenings are reserved.", "upcoming")}</TabsContent>
          <TabsContent value="past" className="space-y-4">{renderBookings(past, "Past screenings will appear here.", "past")}</TabsContent>
          <TabsContent value="cancelled" className="space-y-4">{renderBookings(cancelled, "You have no cancelled reservations.", "cancelled")}</TabsContent>
        </Tabs>
      )}
      <AlertDialog open={Boolean(cancelling)} onOpenChange={(open) => { if (!open && !cancelMutation.isPending) setCancelling(null); }}>
        <AlertDialogContent>
          <AlertDialogTitle>Cancel this reservation?</AlertDialogTitle>
          <AlertDialogDescription>Its seats will be released for other customers. This action cannot be undone.</AlertDialogDescription>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialogCancel disabled={cancelMutation.isPending}>Keep reservation</AlertDialogCancel>
            <AlertDialogAction disabled={cancelMutation.isPending} onClick={(event) => { event.preventDefault(); if (cancelling) cancelMutation.mutate(cancelling); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{cancelMutation.isPending ? "Cancelling…" : "Cancel reservation"}</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
