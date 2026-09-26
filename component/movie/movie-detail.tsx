"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, MapPin, Star } from "lucide-react";
import { useMovieById } from "@/lib/hooks/useMovie";
import { useShowtimesByMovie } from "@/lib/hooks/useShowtimes";
import { formatRuntime } from "@/lib/utils";
import { Button } from "@/component/ui/button";
import { Skeleton } from "@/component/skeleton";
import { ShowtimeCard } from "./showtime-card";
import type { DiscoveryShowtime } from "@/types/discovery";

function dayKey(value: Date | string) {
  const date = new Date(value);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function dayLabel(value: Date | string) {
  return new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(new Date(value));
}

export function MovieDetailsClient({ movieId }: { movieId: string }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(null);
  const movieQuery = useMovieById(movieId);
  const movie = movieQuery.data;
  const showtimeQuery = useShowtimesByMovie(movie?.isActive ? movieId : undefined);
  const showtimes = showtimeQuery.data ?? [];
  const dates = [...new Map(showtimes.map((showtime) => [dayKey(showtime.startTime), dayLabel(showtime.startTime)])).entries()];
  const activeDate = dates.some(([key]) => key === selectedDate) ? selectedDate : dates[0]?.[0];
  const dayShowtimes = showtimes.filter((showtime) => dayKey(showtime.startTime) === activeDate);
  const theaterGroups = new Map<string, DiscoveryShowtime[]>();
  for (const showtime of dayShowtimes) {
    const group = theaterGroups.get(showtime.theaterId) ?? [];
    group.push(showtime);
    theaterGroups.set(showtime.theaterId, group);
  }
  const selectedShowtime = showtimes.find((showtime) => showtime._id === selectedShowtimeId && showtime.availableSeats > 0);

  if (movieQuery.isLoading) {
    return <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8" role="status" aria-live="polite" aria-label="Loading movie"><Skeleton className="h-5 w-28" /><div className="grid gap-8 lg:grid-cols-2"><Skeleton className="h-96 rounded-[24px]" /><Skeleton className="h-96 rounded-[24px]" /></div><Skeleton className="h-72 rounded-[24px]" /></div>;
  }

  if (movieQuery.isError || !movie) {
    return <div role="alert" className="mx-auto max-w-3xl px-4 py-24 text-center"><h1 className="text-3xl font-bold">Movie unavailable</h1><p className="mt-3 text-muted-foreground">{movieQuery.error?.message ?? "This movie could not be found."}</p><div className="mt-6 flex justify-center gap-3"><Button asChild variant="outline"><Link href="/movies">Browse movies</Link></Button><Button onClick={() => void movieQuery.refetch()}>Try again</Button></div></div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-7 sm:px-6 lg:px-8">
      <Link href="/movies" className="mb-7 inline-flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ArrowLeft className="size-4" aria-hidden="true" /> All movies</Link>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-12" aria-labelledby="movie-title">
        <div className="order-2 lg:order-1">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-primary">Film details</p>
          <h1 id="movie-title" className="text-4xl font-bold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-6xl">{movie.title}</h1>
          <div className="mt-5 flex flex-wrap gap-2">{movie.genre.map((genre) => <span key={genre} className="rounded-full border border-border bg-secondary/70 px-3 py-1 text-xs font-semibold text-foreground/85">{genre}</span>)}</div>
          <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{movie.description}</p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-y border-border py-5 text-sm text-foreground/85">
            {movie.duration > 0 && <span className="inline-flex items-center gap-2"><Clock3 className="size-4 text-primary" aria-hidden="true" />{formatRuntime(movie.duration)}</span>}
            {movie.rating > 0 && <span className="inline-flex items-center gap-2"><Star className="size-4 text-primary" aria-hidden="true" />{movie.rating.toFixed(1)}/10 rating</span>}
            {movie.releaseDate && !Number.isNaN(new Date(movie.releaseDate).getTime()) && <span className="inline-flex items-center gap-2"><CalendarDays className="size-4 text-primary" aria-hidden="true" />Released {new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(new Date(movie.releaseDate))}</span>}
          </div>
          {(movie.director || movie.cast?.length > 0) && <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">{movie.director && <div><p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Director</p><p className="font-medium text-foreground">{movie.director}</p></div>}{movie.cast?.length > 0 && <div><p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cast</p><p className="font-medium text-foreground">{movie.cast.join(", ")}</p></div>}</div>}
          {movie.isActive ? <Button asChild size="lg" className="mt-8"><a href="#showtimes">Check showtimes <ArrowRight className="size-4" aria-hidden="true" /></a></Button> : <p className="mt-8 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">This film is not currently available for reservations.</p>}
        </div>
        <div className="relative order-1 aspect-[16/10] overflow-hidden rounded-[24px] border border-border bg-muted lg:order-2 lg:aspect-[5/4]">
          {movie.backdropUrl || movie.posterUrl ? <Image src={movie.backdropUrl || movie.posterUrl} alt={`${movie.title} artwork`} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /> : <div className="grid h-full place-items-center text-muted-foreground">Artwork unavailable</div>}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/35 via-transparent to-transparent" aria-hidden="true" />
        </div>
      </section>

      <section id="showtimes" className="mt-14 scroll-mt-28 border-t border-border pt-12 sm:mt-16" aria-labelledby="showtime-heading">
        <div className="mb-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary">Your next step</p>
          <h2 id="showtime-heading" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Choose a screening</h2>
          <p className="mt-3 text-muted-foreground">Select a date, theater, and time to continue to seats.</p>
        </div>

        {!movie.isActive ? <div className="rounded-[22px] border border-border bg-card p-8 text-muted-foreground">Showtimes are unavailable for this film.</div> : showtimeQuery.isLoading ? (
          <div className="space-y-5" role="status" aria-live="polite" aria-label="Loading showtimes"><Skeleton className="h-16 w-full rounded-xl" /><Skeleton className="h-48 w-full rounded-[22px]" /></div>
        ) : showtimeQuery.isError ? (
          <div role="alert" className="rounded-[22px] border border-border bg-card p-8"><h3 className="text-xl font-bold">Showtimes could not load</h3><p className="mt-2 text-muted-foreground">Please try again before choosing a screening.</p><Button className="mt-5" onClick={() => void showtimeQuery.refetch()}>Try again</Button></div>
        ) : showtimes.length === 0 ? (
          <div className="rounded-[22px] border border-border bg-card p-8 sm:p-10"><h3 className="text-xl font-bold">No upcoming showtimes</h3><p className="mt-2 max-w-xl text-muted-foreground">This film has no scheduled screenings right now. Explore the catalog for another movie.</p><Button asChild variant="outline" className="mt-6"><Link href="/movies">Browse movies</Link></Button></div>
        ) : (
          <>
            <div className="mb-7 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Choose a showtime date">
              {dates.map(([key, label]) => <button key={key} type="button" aria-pressed={activeDate === key} onClick={() => { setSelectedDate(key); setSelectedShowtimeId(null); }} className={`shrink-0 rounded-xl border px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeDate === key ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>{label}</button>)}
            </div>
            <div className="space-y-5">
              {[...theaterGroups.entries()].map(([theaterId, screenings]) => (
                <div key={theaterId} className="rounded-[22px] border border-border bg-card p-5 sm:p-7">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
                    <div><h3 className="text-lg font-bold text-foreground">{screenings[0].theaterName}</h3><p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-4" aria-hidden="true" />{screenings[0].theaterLocation}</p></div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{screenings.length} {screenings.length === 1 ? "screening" : "screenings"}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">{screenings.map((showtime) => <ShowtimeCard key={showtime._id} showtime={showtime} selected={selectedShowtimeId === showtime._id} onSelect={() => setSelectedShowtimeId(showtime._id)} />)}</div>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-5 rounded-[22px] border border-border bg-secondary/55 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Selected screening</p><p className="mt-1 font-semibold text-foreground">{selectedShowtime ? `${selectedShowtime.theaterName} · ${new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(selectedShowtime.startTime))}` : "Choose an available time above"}</p>{selectedShowtime && <p className="mt-1 text-sm text-muted-foreground">${selectedShowtime.price.toFixed(2)} per seat · {selectedShowtime.availableSeats} seats left</p>}</div>
              {selectedShowtime ? <Button asChild size="lg"><Link href={`/seats/${selectedShowtime._id}`}>Continue to seats <ArrowRight className="size-4" aria-hidden="true" /></Link></Button> : <Button size="lg" disabled>Continue to seats</Button>}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
