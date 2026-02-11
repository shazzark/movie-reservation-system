"use client";

import { Card } from "../../component/ui/card";
import { Button } from "../../component/ui/button";
import { Badge } from "../../component/ui/badge";
import Link from "next/link";
import Image from "next/image";
// ✅ Change this to your actual type definition file
import type { Movie } from "../../types/movie";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

export function MovieCard({ movie, index = 0 }: MovieCardProps) {
  // ✅ MongoDB uses _id. If you use .id, it will be undefined.
  const movieId = movie._id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
    >
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
        {/* Poster Image */}
        <div className="relative w-full h-64 overflow-hidden bg-muted">
          <Image
            src={movie.posterUrl || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          <div className="flex flex-wrap gap-1 mb-3">
            {movie.genre.slice(0, 2).map((g) => (
              <Badge key={g} variant="secondary" className="text-xs">
                {g}
              </Badge>
            ))}
          </div>

          <h3 className="text-lg font-bold mb-2 line-clamp-2 text-foreground">
            {movie.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
            {movie.description}
          </p>

          <div className="flex items-center gap-1 mb-4">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-sm font-semibold text-foreground">
              {movie.rating}
            </span>
            <span className="text-xs text-muted-foreground">
              ({movie.duration} min)
            </span>
          </div>

          {/* ✅ Fixed Link to use _id */}
          <Link href={`/movie/${movieId}`} className="w-full cursor-pointer">
            <Button variant="default" className="w-full" size="sm">
              Book Now
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
