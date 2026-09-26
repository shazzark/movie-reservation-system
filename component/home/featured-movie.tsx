import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MovieCard } from "./movie-card";
import type { DiscoveryMovie } from "@/types/discovery";

export function FeaturedMovies({ movies }: { movies: DiscoveryMovie[] }) {
  const bookable = movies.filter((movie) => movie.availableShowtimeCount > 0);
  const display = (bookable.length ? bookable : movies).slice(0, 3);

  return (
    <section className="py-16 sm:py-20" aria-labelledby="home-movies-heading">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary">Discover</p>
          <h2 id="home-movies-heading" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{bookable.length ? "Now showing" : "Explore the lineup"}</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">{bookable.length ? "Find a film and choose a screening that works for you." : "Explore available films. New showtimes will appear here when scheduled."}</p>
        </div>
        <Link href="/movies" className="inline-flex w-fit items-center gap-2 rounded-lg py-2 text-sm font-semibold text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Browse the catalog <ArrowRight className="size-4" aria-hidden="true" /></Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {display.map((movie) => <MovieCard key={movie._id} movie={movie} />)}
      </div>
    </section>
  );
}
