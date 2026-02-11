"use client";
import api from "../../lib/api"; // ✅ Hooked to your api.ts
import { formatRuntime, getRatingColor } from "../../lib/utils";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Clock, CalendarDays, Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Movie } from "../../types/movie"; // ✅ Imported your type definition
import { Button } from "../../component/ui/button";
import { Input } from "../../component/ui/input";
import { Badge } from "../../component/ui/badge";
import { Card } from "../../component/ui/card";

import Image from "next/image";

export function MoviesClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // ✅ Typed query result
  const {
    data: movies = [],
    isLoading,
    isError,
  } = useQuery<Movie[]>({
    queryKey: ["movies"],
    queryFn: () => api.movies.getAll(),
  });

  // Get all unique genres - Typed as string
  const allGenres = Array.from(
    new Set(movies.flatMap((movie) => movie.genre)),
  ).sort();

  // Filter movies based on search and genre - Typed as Movie
  const filteredMovies = movies.filter((movie: Movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || movie.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // const itemVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 0.4,
  //     },
  //   },
  // };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-red-500">
          Error loading movies. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <section className="py-12 md:py-16 border-b border-purple-500/20">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-3">
              All Movies
            </h1>
            <p className="text-slate-400 text-lg">
              Browse and book your favorite movies
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
              <Input
                type="text"
                placeholder="Search movies by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Genre Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setSelectedGenre(null)}
                variant={selectedGenre === null ? "default" : "outline"}
                size="sm"
                className={
                  selectedGenre === null
                    ? "bg-linear-to-r from-purple-600 to-pink-600"
                    : ""
                }
              >
                All Genres
              </Button>
              {allGenres.map((genre) => (
                <Button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  size="sm"
                  className={
                    selectedGenre === genre
                      ? "bg-linear-to-r from-purple-600 to-pink-600"
                      : ""
                  }
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          {filteredMovies.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-xl text-slate-400 mb-4">
                No movies found matching your criteria.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGenre(null);
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredMovies.map(
                (
                  movie: Movie, // ✅ Type specified
                ) => (
                  <div key={movie._id}>
                    <Link href={`/movie/${movie._id}`}>
                      <Card className="h-full overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-pink-500/30">
                        {/* Poster */}
                        <div className="relative h-64 overflow-hidden bg-slate-900/50">
                          <Image
                            src={movie.posterUrl || "/placeholder.svg"}
                            alt={movie.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <Button className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                              Book Now
                            </Button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col gap-3">
                          {/* Title */}
                          <h3 className="font-bold text-lg text-white line-clamp-2 group-hover:text-pink-400 transition-colors">
                            {movie.title}
                          </h3>

                          {/* Genres */}
                          <div className="flex flex-wrap gap-1">
                            {movie.genre.slice(0, 2).map((gen) => (
                              <Badge
                                key={gen}
                                variant="secondary"
                                className="text-xs"
                              >
                                {gen}
                              </Badge>
                            ))}
                          </div>

                          {/* Rating and Duration */}
                          <div className="flex items-center justify-between text-sm text-slate-300">
                            <div className="flex items-center gap-1">
                              <Star
                                className={`h-4 w-4 ${getRatingColor(movie.rating)}`}
                              />
                              <span className="font-semibold">
                                {movie.rating.toFixed(1)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-purple-400" />
                              <span>{formatRuntime(movie.duration)}</span>
                            </div>
                          </div>

                          {/* Release Date */}
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <CalendarDays className="h-4 w-4" />
                            <span>
                              {new Date(movie.releaseDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>

                          {/* Director */}
                          <p className="text-xs text-slate-500 line-clamp-1">
                            Dir: {movie.director}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  </div>
                ),
              )}
            </motion.div>
          )}

          {/* Results Count */}
          <div className="mt-8 text-center text-slate-400">
            <p>
              Showing {filteredMovies.length} of {movies.length} movies
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
