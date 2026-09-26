"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, MapPin, Ticket } from "lucide-react";
import { useShowtimeDetails } from "../../lib/hooks/useShowtimes";
import { useMovieById } from "../../lib/hooks/useMovie";
import { ApiRequestError, bookingApi } from "../../lib/api";
import { rowLabel } from "../../lib/booking-rules";
import { formatRuntime } from "../../lib/utils";
import { Skeleton } from "../../component/skeleton";
import { Button } from "../../component/ui/button";
import { Card } from "../../component/ui/card";
import { SeatMap } from "./seat-map";
import { ReservationSummary } from "../booking/reservation-summary";
import type { Seat } from "../../types/seat";

interface SeatSelectionClientProps {
  showtimeId: string;
}

type BookingStep = "seats" | "review";

function stepUrl(showtimeId: string, step: BookingStep) {
  return step === "review" ? `/seats/${showtimeId}?step=review` : `/seats/${showtimeId}`;
}

export function SeatSelectionClient({ showtimeId }: SeatSelectionClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const restoredForShowtime = useRef<string | null>(null);
  const storageKey = `cinebook:reservation:${showtimeId}`;
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [step, setStep] = useState<BookingStep>("seats");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: showtimeData, isLoading, isError, error, refetch } = useShowtimeDetails(showtimeId);
  const movieQuery = useMovieById(showtimeData?.showtime.movieId);
  const movie = movieQuery.data;

  const seats = useMemo<Seat[]>(() => {
    if (!showtimeData) return [];
    const { rows, seatsPerRow, totalSeats } = showtimeData.theater;
    if (!Number.isSafeInteger(rows) || !Number.isSafeInteger(seatsPerRow) || rows < 1 || seatsPerRow < 1 || rows * seatsPerRow !== totalSeats || totalSeats !== showtimeData.showtime.totalSeats || totalSeats > 2500) return [];
    const occupied = new Set(showtimeData.showtime.bookedSeats ?? []);
    return Array.from({ length: rows }, (_, rowIndex) => {
      const row = rowLabel(rowIndex);
      return Array.from({ length: seatsPerRow }, (_, index) => {
        const id = `${row}${index + 1}`;
        return { id, showtimeId, row, seatNumber: index + 1, isAvailable: !occupied.has(id), type: "regular" as const };
      });
    }).flat();
  }, [showtimeData, showtimeId]);

  useEffect(() => {
    if (!showtimeData || restoredForShowtime.current === showtimeId) return;
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? "[]") as unknown;
      if (Array.isArray(saved)) {
        const availableIds = new Set(seats.filter((seat) => seat.isAvailable).map((seat) => seat.id));
        setSelectedSeatIds(saved.filter((seat): seat is string => typeof seat === "string" && availableIds.has(seat)));
      }
    } catch {
      sessionStorage.removeItem(storageKey);
    }
    setStep(new URL(window.location.href).searchParams.get("step") === "review" ? "review" : "seats");
    restoredForShowtime.current = showtimeId;
  }, [seats, showtimeData, showtimeId, storageKey]);

  const selectedSeats = seats.filter((seat) => selectedSeatIds.includes(seat.id));
  const selectedLabels = selectedSeats.map((seat) => seat.id);
  const availableSeatCount = seats.filter((seat) => seat.isAvailable).length;
  const occupiedSeatCount = seats.length - availableSeatCount;
  const { showtime, theater } = showtimeData ?? {};
  const startsAt = showtime?.startTime;
  const showtimeExpired = startsAt ? new Date(startsAt).getTime() <= Date.now() : false;

  const toggleSeat = (seat: Seat) => {
    if (!seat.isAvailable || step !== "seats" || showtimeExpired) return;
    setBookingError(null);
    setSelectedSeatIds((current) => {
      const next = current.includes(seat.id) ? current.filter((id) => id !== seat.id) : [...current, seat.id];
      sessionStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const openReview = () => {
    if (!selectedLabels.length || showtimeExpired) return;
    sessionStorage.setItem(storageKey, JSON.stringify(selectedLabels));
    setBookingError(null);
    setStep("review");
    router.push(stepUrl(showtimeId, "review"), { scroll: false });
  };

  const editSeats = () => {
    setBookingError(null);
    setStep("seats");
    router.replace(stepUrl(showtimeId, "seats"), { scroll: false });
  };

  const confirmReservation = async () => {
    if (!selectedLabels.length || isSubmitting || showtimeExpired) return;
    setBookingError(null);
    setIsSubmitting(true);
    try {
      const response = await bookingApi.createBooking({ showtimeId, seats: selectedLabels });
      const booking = response.data;
      if (!response.success || !booking?._id) throw new Error("CineBook did not return a saved reservation.");
      sessionStorage.removeItem(storageKey);
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ["showtime", showtimeId] }),
        queryClient.invalidateQueries({ queryKey: ["seats", showtimeId] }),
        queryClient.invalidateQueries({ queryKey: ["showtimes"] }),
        queryClient.invalidateQueries({ queryKey: ["discovery-movies"] }),
        queryClient.invalidateQueries({ queryKey: ["bookings"] }),
      ]);
      router.push(`/confirmation/${booking._id}`);
    } catch (cause) {
      if (cause instanceof ApiRequestError && cause.status === 401) {
        sessionStorage.setItem(storageKey, JSON.stringify(selectedLabels));
        router.push(`/login?callbackUrl=${encodeURIComponent(stepUrl(showtimeId, "review"))}`);
        return;
      }
      if (cause instanceof ApiRequestError && cause.status === 409) {
        await queryClient.invalidateQueries({ queryKey: ["showtime", showtimeId] });
        await queryClient.refetchQueries({ queryKey: ["showtime", showtimeId], type: "active" });
        const expired = cause.message.toLowerCase().includes("already started");
        if (!expired) setSelectedSeatIds([]);
        if (!expired) sessionStorage.setItem(storageKey, "[]");
        setStep("seats");
        router.replace(stepUrl(showtimeId, "seats"), { scroll: false });
        setBookingError(expired
          ? "This screening has already started, so a reservation can no longer be made."
          : "Those seats were just reserved by another customer. Availability has been refreshed; please choose again.");
        return;
      }
      setBookingError(cause instanceof Error ? cause.message : "Could not create your reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || (showtimeData && movieQuery.isLoading)) {
    return <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8" role="status" aria-live="polite" aria-label="Loading reservation"><Skeleton className="h-8 w-52" /><Skeleton className="h-40 rounded-3xl" /><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"><Skeleton className="h-[520px] rounded-3xl" /><Skeleton className="h-[420px] rounded-3xl" /></div></div>;
  }

  if (isError || !showtimeData) {
    return <div className="mx-auto max-w-2xl px-4 py-24 text-center" role="alert"><h1 className="text-3xl font-bold">Screening unavailable</h1><p className="mt-3 text-muted-foreground">{error?.message ?? "This screening could not be found."}</p><div className="mt-6 flex justify-center gap-3"><Button variant="outline" onClick={() => void refetch()}>Try again</Button><Button asChild><Link href="/movies">Browse movies</Link></Button></div></div>;
  }

  if (!movie || movieQuery.isError) {
    return <div className="mx-auto max-w-2xl px-4 py-24 text-center" role="alert"><h1 className="text-3xl font-bold">Movie details unavailable</h1><p className="mt-3 text-muted-foreground">We could not load the movie attached to this screening.</p><Button className="mt-6" onClick={() => void movieQuery.refetch()}>Try again</Button></div>;
  }

  if (!showtime || !theater) {
    return <div className="mx-auto max-w-2xl px-4 py-24 text-center" role="alert"><h1 className="text-3xl font-bold">Screening details unavailable</h1><p className="mt-3 text-muted-foreground">The showtime response did not include its theater details.</p><Button className="mt-6" onClick={() => void refetch()}>Try again</Button></div>;
  }

  const summaryProps = {
    movieTitle: movie.title,
    posterUrl: movie.posterUrl,
    theaterName: theater.name,
    theaterLocation: theater.location,
    startsAt: showtime.startTime,
    seats: selectedLabels,
    pricePerSeat: showtime.price,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-7 sm:px-6 sm:pb-16 lg:px-8">
      <Link href={`/movie/${showtime.movieId}`} className="mb-6 inline-flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to movie
      </Link>

      <div className="mb-7 flex items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Reservation</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{step === "seats" ? "Choose your seats" : "Review your reservation"}</h1></div>
        <p className="hidden text-sm text-muted-foreground sm:block">Step {step === "seats" ? "1" : "2"} of 2</p>
      </div>

      <Card className="mb-7 grid gap-5 border-border p-4 sm:grid-cols-[100px_minmax(0,1fr)] sm:items-center sm:p-5">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted sm:aspect-square">
          <Image src={movie.posterUrl} alt={`${movie.title} artwork`} fill sizes="(max-width: 640px) 100vw, 100px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-bold sm:text-2xl">{movie.title}</h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><MapPin className="size-4 text-primary" aria-hidden="true" />{theater.name} · {theater.location}</span>
            <span className="inline-flex items-center gap-2"><CalendarDays className="size-4 text-primary" aria-hidden="true" />{new Intl.DateTimeFormat(undefined, { weekday: "long", month: "short", day: "numeric", year: "numeric" }).format(new Date(showtime.startTime))}</span>
            <span className="inline-flex items-center gap-2"><Clock3 className="size-4 text-primary" aria-hidden="true" />{new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(showtime.startTime))} · {showtime.format}</span>
            <span className="inline-flex items-center gap-2"><Ticket className="size-4 text-primary" aria-hidden="true" />{formatRuntime(movie.duration)} · ${showtime.price.toFixed(2)} per seat</span>
          </div>
        </div>
      </Card>

      {showtimeExpired && <div role="alert" className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">This screening has already started. Reservations are closed.</div>}
      {bookingError && <div role="alert" className="mb-6 rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm text-foreground">{bookingError}</div>}

      {step === "seats" ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <Card className="min-w-0 space-y-6 border-border p-4 sm:p-6 lg:p-8">
            <div><div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-lg font-bold">Select seats</h2><p className="text-xs font-medium text-muted-foreground" aria-live="polite">{availableSeatCount} available · {occupiedSeatCount} occupied</p></div><p className="mt-1 text-sm text-muted-foreground">Choose available seats for this screening. Occupied seats cannot be selected.</p></div>
            {seats.length ? <SeatMap seats={seats} selectedSeats={selectedSeats} onSeatToggle={toggleSeat} /> : <div role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-5 text-sm">The theater seat layout is not configured correctly for this screening.</div>}
          </Card>

          <Card className="border-border p-5 sm:p-6 lg:sticky lg:top-24">
            <ReservationSummary {...summaryProps} />
            <Button className="mt-6 w-full" size="lg" disabled={!selectedSeats.length || showtimeExpired || !seats.length} onClick={openReview}>
              Review reservation <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Your seats are not reserved until you confirm.</p>
          </Card>
        </div>
      ) : (
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <Card className="border-border p-5 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Final review</p>
            <h2 className="mt-2 text-2xl font-bold">Check your screening details</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Confirming creates your reservation and holds the selected seats. Payment is not collected in this demo.</p>
            <div className="mt-6 rounded-xl border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
              The displayed total is an estimate. CineBook checks seat availability and calculates the saved total when you confirm.
            </div>
          </Card>
          <Card className="border-border p-5 sm:p-6">
            <ReservationSummary {...summaryProps} />
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Button variant="outline" size="lg" disabled={isSubmitting} onClick={editSeats}><ArrowLeft className="size-4" aria-hidden="true" /> Edit seats</Button>
              <Button size="lg" disabled={isSubmitting || !selectedSeats.length || showtimeExpired} onClick={() => void confirmReservation()}>{isSubmitting ? "Confirming reservation…" : "Confirm reservation"}</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
