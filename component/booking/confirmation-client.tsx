"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Check, Clock3, MapPin, Ticket } from "lucide-react";
import api from "@/lib/api";
import { useMovieById } from "@/lib/hooks/useMovie";
import { Skeleton } from "@/component/skeleton";
import { Button } from "@/component/ui/button";
import { Card } from "@/component/ui/card";
import { Badge } from "@/component/ui/badge";

export function ConfirmationClient({ bookingId }: { bookingId: string }) {
  const bookingQuery = useQuery({ queryKey: ["booking", bookingId], queryFn: () => api.booking.getById(bookingId) });
  const booking = bookingQuery.data?.data;
  const movieQuery = useMovieById(booking?.movieId);
  const movie = movieQuery.data;

  if (bookingQuery.isLoading || (booking && movieQuery.isLoading)) {
    return <div className="mx-auto max-w-3xl space-y-5 px-4 py-12 sm:px-6" role="status" aria-live="polite" aria-label="Loading reservation"><Skeleton className="mx-auto h-14 w-14 rounded-full" /><Skeleton className="mx-auto h-10 w-72" /><Skeleton className="h-80 rounded-3xl" /></div>;
  }

  if (bookingQuery.error || !booking) {
    return <div className="mx-auto max-w-2xl px-4 py-24 text-center" role="alert"><h1 className="text-3xl font-bold">Reservation unavailable</h1><p className="mt-3 text-muted-foreground">{bookingQuery.error instanceof Error ? bookingQuery.error.message : "This reservation could not be loaded."}</p><div className="mt-6 flex justify-center gap-3"><Button variant="outline" onClick={() => void bookingQuery.refetch()}>Try again</Button><Button asChild><Link href="/profile">View reservation history</Link></Button></div></div>;
  }

  const confirmed = booking.status === "confirmed";
  const cancelled = booking.status === "cancelled";
  const start = booking.showtime ? new Date(booking.showtime.startTime) : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <div className={`mx-auto mb-5 grid size-14 place-items-center rounded-full border ${confirmed ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" : "border-border bg-card text-muted-foreground"}`}>
          {confirmed ? <Check className="size-7" aria-hidden="true" /> : <Ticket className="size-6" aria-hidden="true" />}
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Reservation details</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{confirmed ? "Reservation confirmed" : cancelled ? "Reservation cancelled" : "Reservation status"}</h1>
        <p className="mt-3 text-muted-foreground">{confirmed ? "Your seats are reserved. Keep this reference for your records." : cancelled ? "This reservation has been cancelled and the seats were released." : "The current status of your reservation is shown below."}</p>
      </div>

      <Card className="overflow-hidden border-border">
        <div className="grid sm:grid-cols-[220px_minmax(0,1fr)]">
          <div className="relative aspect-[16/10] bg-muted sm:aspect-auto sm:min-h-[430px]">
            {movie?.posterUrl && <Image src={movie.posterUrl} alt={`${movie.title} artwork`} fill sizes="(max-width: 640px) 100vw, 220px" className="object-cover" />}
          </div>
          <div className="p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Movie</p><h2 className="mt-1 text-2xl font-bold">{movie?.title ?? "Movie details unavailable"}</h2></div>
              <Badge variant={confirmed ? "default" : cancelled ? "secondary" : "outline"} className="capitalize">{booking.status}</Badge>
            </div>

            <div className="mt-6 grid gap-x-5 gap-y-5 sm:grid-cols-2">
              <div className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /><div><p className="text-xs text-muted-foreground">Theater</p><p className="mt-1 font-semibold">{booking.theater?.name ?? "Theater details unavailable"}</p><p className="text-sm text-muted-foreground">{booking.theater?.location ?? ""}</p></div></div>
              <div className="flex gap-3"><Clock3 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /><div><p className="text-xs text-muted-foreground">Showtime</p><p className="mt-1 font-semibold">{start ? new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(start) : "Showtime details unavailable"}</p></div></div>
              <div className="flex gap-3"><Ticket className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /><div><p className="text-xs text-muted-foreground">Seats</p><p className="mt-1 font-semibold">{booking.seats.join(", ")}</p><p className="text-sm text-muted-foreground">{booking.seats.length} {booking.seats.length === 1 ? "ticket" : "tickets"} · ${booking.showtime?.price.toFixed(2) ?? "—"} per seat</p></div></div>
              <div><p className="text-xs text-muted-foreground">Reservation reference</p><p className="mt-1 break-all font-mono text-sm font-semibold">{booking._id}</p></div>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
              <span className="font-semibold">Reservation total</span>
              <span className="text-2xl font-bold">${booking.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="flex-1"><Link href="/profile">View reservation history</Link></Button>
        <Button asChild variant="outline" className="flex-1"><Link href="/movies">Browse movies</Link></Button>
      </div>
    </div>
  );
}
