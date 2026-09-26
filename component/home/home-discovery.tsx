"use client";

import { useDiscoveryMovies } from "@/lib/hooks/useMovie";
import { Button } from "@/component/ui/button";
import { Skeleton } from "@/component/skeleton";
import { HeroSection } from "./hero-section";
import { FeaturedMovies } from "./featured-movie";

export function HomeDiscovery() {
  const { data: movies = [], isLoading, isError, refetch } = useDiscoveryMovies();
  const featuredMovies = [
    ...movies.filter((movie) => movie.availableShowtimeCount > 0),
    ...movies.filter((movie) => movie.availableShowtimeCount === 0),
  ].slice(0, 5);
  const hero = featuredMovies[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {isLoading ? (
        <div className="space-y-12 py-8" role="status" aria-live="polite" aria-label="Loading movies">
          <Skeleton className="h-[540px] w-full rounded-[28px]" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((index) => <Skeleton key={index} className="h-80 rounded-[22px]" />)}</div>
        </div>
      ) : isError ? (
        <div role="alert" className="my-20 rounded-[28px] border border-border bg-card px-6 py-16 text-center">
          <h1 className="text-3xl font-bold">The lineup could not load</h1>
          <p className="mt-3 text-muted-foreground">Please try again in a moment.</p>
          <Button className="mt-6" onClick={() => void refetch()}>Try again</Button>
        </div>
      ) : !hero ? (
        <div className="my-20 rounded-[28px] border border-border bg-card px-6 py-16 text-center">
          <h1 className="text-3xl font-bold">No movies available right now</h1>
          <p className="mt-3 text-muted-foreground">Check back when new films are added.</p>
        </div>
      ) : (
        <>
          <div className="pt-6 sm:pt-8"><HeroSection movies={featuredMovies} /></div>
          <FeaturedMovies movies={movies} />
        </>
      )}
    </div>
  );
}
