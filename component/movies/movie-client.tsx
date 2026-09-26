"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useDiscoveryMovies } from "@/lib/hooks/useMovie";
import { MovieCard } from "@/component/home/movie-card";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { Skeleton } from "@/component/skeleton";

export function MoviesClient() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState<string | null>(null);
  const { data: movies = [], isLoading, isError, refetch } = useDiscoveryMovies();
  const genres = [...new Set(movies.flatMap((movie) => movie.genre))].sort();
  const query = search.trim().toLocaleLowerCase();
  const filtered = movies.filter((movie) =>
    (!query || movie.title.toLocaleLowerCase().includes(query) || movie.description.toLocaleLowerCase().includes(query)) &&
    (!genre || movie.genre.includes(genre))
  );

  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-card/45">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-primary">The CineBook lineup</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Find a film worth going out for.</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">Explore the current movie collection and open a film to see its upcoming screenings.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 space-y-5">
          <div className="relative max-w-xl">
            <label htmlFor="movie-search" className="sr-only">Search movies</label>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="movie-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title or story"
              className="h-12 rounded-xl border-border bg-card pl-12 text-base"
            />
          </div>
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter movies by genre">
              <Button type="button" size="sm" variant={genre === null ? "default" : "outline"} aria-pressed={genre === null} onClick={() => setGenre(null)}>All genres</Button>
              {genres.map((item) => <Button key={item} type="button" size="sm" variant={genre === item ? "default" : "outline"} aria-pressed={genre === item} onClick={() => setGenre(item)}>{item}</Button>)}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-live="polite" aria-label="Loading movies">
            {[0, 1, 2, 3, 4, 5].map((index) => <Skeleton key={index} className="h-88 rounded-[22px]" />)}
          </div>
        ) : isError ? (
          <div role="alert" className="rounded-[22px] border border-border bg-card px-6 py-14 text-center">
            <h2 className="text-2xl font-bold">Movies could not load</h2>
            <p className="mt-2 text-muted-foreground">Please try again in a moment.</p>
            <Button className="mt-5" onClick={() => void refetch()}>Try again</Button>
          </div>
        ) : movies.length === 0 ? (
          <div className="rounded-[22px] border border-border bg-card px-6 py-14 text-center">
            <h2 className="text-2xl font-bold">No movies available right now</h2>
            <p className="mt-2 text-muted-foreground">New films will appear here when added.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[22px] border border-border bg-card px-6 py-14 text-center">
            <h2 className="text-2xl font-bold">No movies match your search</h2>
            <p className="mt-2 text-muted-foreground">Try another title, story, or genre.</p>
            <Button variant="outline" className="mt-5" onClick={() => { setSearch(""); setGenre(null); }}>Clear filters</Button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-bold text-foreground">Movies</h2>
              <p className="text-sm text-muted-foreground" aria-live="polite">{filtered.length} {filtered.length === 1 ? "film" : "films"}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((movie) => <MovieCard key={movie._id} movie={movie} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
