"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock3, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/component/ui/button";
import { formatRuntime } from "@/lib/utils";
import type { DiscoveryMovie } from "@/types/discovery";

const ROTATION_INTERVAL_MS = 6_500;

export function HeroSection({ movies }: { movies: DiscoveryMovie[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHoveredOrFocused, setIsHoveredOrFocused] = useState(false);
  const reduceMotion = useReducedMotion();
  const movie = movies[activeIndex] ?? movies[0];

  useEffect(() => {
    if (reduceMotion || !isPlaying || isHoveredOrFocused || movies.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % movies.length);
    }, ROTATION_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isHoveredOrFocused, isPlaying, movies.length, reduceMotion]);

  if (!movie) return null;

  const showMovie = (index: number) => {
    setActiveIndex((index + movies.length) % movies.length);
    setIsPlaying(false);
  };
  const backdrop = movie.backdropUrl || movie.posterUrl;
  const transitionDuration = reduceMotion ? 0 : 0.65;

  return (
    <section
      aria-label="Featured movies"
      aria-roledescription="carousel"
      className="relative isolate min-h-[650px] overflow-hidden rounded-[28px] border border-border bg-card sm:min-h-[590px] lg:min-h-[560px]"
      onPointerEnter={() => setIsHoveredOrFocused(true)}
      onPointerLeave={() => setIsHoveredOrFocused(false)}
      onFocusCapture={() => setIsHoveredOrFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsHoveredOrFocused(false);
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={movie._id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.025 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ opacity: { duration: transitionDuration }, scale: { duration: reduceMotion ? 0 : ROTATION_INTERVAL_MS / 1_000, ease: "linear" } }}
          aria-hidden="true"
        >
          {backdrop ? <Image
            src={backdrop}
            alt=""
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 80vw"
            className="object-cover object-[center_32%]"
          /> : <div className="absolute inset-0 bg-card" />}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-linear-to-t from-background via-background/95 via-45% to-background/10 sm:bg-linear-to-r sm:from-background sm:via-background/90 sm:via-40% sm:to-background/10" aria-hidden="true" />
      <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-black/15" aria-hidden="true" />

      <div className="relative z-10 flex min-h-[650px] flex-col justify-end px-5 pb-5 pt-52 sm:min-h-[590px] sm:px-9 sm:pb-8 sm:pt-24 lg:min-h-[560px] lg:px-14">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={movie._id}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: transitionDuration, ease: "easeOut" }}
            aria-live={isPlaying ? "off" : "polite"}
            aria-atomic="true"
            className="max-w-2xl"
          >
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-primary"><span className="h-px w-7 bg-primary" /> CineBook spotlight</p>
            <h1 className="max-w-xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">{movie.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-white/90">
              {movie.genre.slice(0, 2).map((genre) => <span key={genre}>{genre}</span>)}
              {movie.duration > 0 && <span className="inline-flex items-center gap-1.5"><Clock3 className="size-4" aria-hidden="true" />{formatRuntime(movie.duration)}</span>}
              {movie.rating > 0 && <span>Rating {movie.rating.toFixed(1)}/10</span>}
            </div>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg line-clamp-3">{movie.description}</p>
            <p className="mt-3 text-sm font-medium text-white/90">{movie.availableShowtimeCount > 0 ? `${movie.availableShowtimeCount} upcoming ${movie.availableShowtimeCount === 1 ? "screening" : "screenings"} with seats` : movie.upcomingShowtimeCount > 0 ? "Upcoming screenings are sold out" : "Showtimes have not been scheduled yet"}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href={`/movie/${movie._id}`}>{movie.availableShowtimeCount > 0 ? "Explore showtimes" : "View film"}<ArrowRight className="size-4" aria-hidden="true" /></Link></Button>
              <Button asChild variant="outline" size="lg" className="border-white/35 bg-black/20 text-white hover:bg-white/15 hover:text-white"><Link href="/movies">Browse all movies</Link></Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {movies.length > 1 && <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2" role="group" aria-label="Choose a featured movie">
            {movies.map((item, index) => <button
              key={item._id}
              type="button"
              aria-label={`Show ${item.title}`}
              aria-pressed={index === activeIndex}
              onClick={() => showMovie(index)}
              className={`h-2.5 rounded-full transition-[width,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${index === activeIndex ? "w-7 bg-primary" : "w-2.5 bg-white/55 hover:bg-white/85"}`}
            />)}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="icon" aria-label="Previous featured movie" className="size-10 border-white/35 bg-black/20 text-white hover:bg-white/15 hover:text-white" onClick={() => showMovie(activeIndex - 1)}><ChevronLeft className="size-4" aria-hidden="true" /></Button>
            <Button type="button" variant="outline" size="icon" aria-label="Next featured movie" className="size-10 border-white/35 bg-black/20 text-white hover:bg-white/15 hover:text-white" onClick={() => showMovie(activeIndex + 1)}><ChevronRight className="size-4" aria-hidden="true" /></Button>
            {!reduceMotion && <Button type="button" variant="outline" size="icon" aria-label={isPlaying ? "Pause featured movies" : "Play featured movies"} className="size-10 border-white/35 bg-black/20 text-white hover:bg-white/15 hover:text-white" onClick={() => setIsPlaying((playing) => !playing)}>{isPlaying ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}</Button>}
          </div>
        </div>}
      </div>
    </section>
  );
}
