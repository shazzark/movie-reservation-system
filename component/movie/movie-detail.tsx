"use client";

import { useMovieById } from "../../lib/hooks/useMovie";
import { useShowtimesByMovie } from "../../lib/hooks/useShowtimes";
import { useState } from "react";
import { Skeleton } from "../../component/skeleton";
import { Button } from "../../component/ui/button";
import { Badge } from "../../component/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ShowtimeCard } from "./showtime-card";
import { Star, Calendar, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

interface MovieDetailsClientProps {
  movieId: string;
}

export function MovieDetailsClient({ movieId }: MovieDetailsClientProps) {
  const { data: movie, isLoading: movieLoading } = useMovieById(movieId);
  const { data: showtimes = [], isLoading: showtimesLoading } =
    useShowtimesByMovie(movieId);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(
    null,
  );

  if (movieLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Movie not found
        </h2>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-6xl px-4 py-12"
    >
      {/* Movie Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Poster */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-96 w-full rounded-lg overflow-hidden shadow-xl"
        >
          <Image
            src={movie.posterUrl || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2"
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genre.map((g) => (
              <Badge key={g} variant="secondary">
                {g}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {movie.title}
          </h1>

          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-6 border-y border-border">
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Star className="h-4 w-4" />
                Rating
              </p>
              <p className="text-2xl font-bold text-accent">
                {movie.rating}/10
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Duration
              </p>
              <p className="text-2xl font-bold text-foreground">
                {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Release
              </p>
              <p className="text-lg font-bold text-foreground">
                {new Date(movie.releaseDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Users className="h-4 w-4" />
                Director
              </p>
              <p className="text-lg font-bold text-foreground">
                {movie.director}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p>
              <span className="text-muted-foreground text-sm">Cast: </span>
              <span className="text-foreground">
                {movie.cast && movie.cast.length > 0
                  ? movie.cast.join(", ")
                  : "N/A"}
              </span>
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {movie.description}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Showtimes Selection */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">
          Select Showtime
        </h2>

        {showtimesLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : showtimes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-6">
              No showtimes available for this movie
            </p>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {showtimes.map((showtime, index) => (
              <ShowtimeCard
                key={showtime._id} // ✅ Changed from .id to ._id
                showtime={showtime}
                theaterName={
                  showtime.theaterId === "theater-1"
                    ? "Grand Cinema Palace"
                    : showtime.theaterId === "theater-2"
                      ? "Silver Screen Luxe"
                      : "Elite IMAX Experience"
                }
                isSelected={selectedShowtimeId === showtime._id} // ✅ Changed from .id to ._id
                onSelect={() => setSelectedShowtimeId(showtime._id)} // ✅ Changed from .id to ._id
                index={index}
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        {showtimes.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </Link>
            <Link
              href={selectedShowtimeId ? `/seats/${selectedShowtimeId}` : "#"}
              className="flex-1"
            >
              <Button className="w-full" disabled={!selectedShowtimeId}>
                Continue to Seats
              </Button>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
