"use client";

import { useMovies } from "../../lib/hooks/useMovie";
import { MovieCard } from "./movie-card";
import { Skeleton } from "../../component/skeleton";
import { motion } from "framer-motion";

export function FeaturedMovies() {
  const { data: movies = [], isLoading } = useMovies();

  return (
    <section id="featured" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Featured Movies
          </h2>
          <p className="text-muted-foreground text-lg">
            Check out our latest and most popular selections
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.slice(0, 3).map((movie, index) => (
              <MovieCard key={movie._id} movie={movie} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
