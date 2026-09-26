import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { DiscoveryMovie } from "@/types/discovery";
import { formatRuntime } from "@/lib/utils";

export function MovieCard({ movie }: { movie: DiscoveryMovie }) {
  const bookable = movie.availableShowtimeCount > 0;
  const hasShowtimes = movie.upcomingShowtimeCount > 0;

  return (
    <Link
      href={`/movie/${movie._id}`}
      className="group block h-full rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      aria-label={`View ${movie.title}${bookable ? " and its showtimes" : ""}`}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-[22px] border border-border bg-card transition-colors duration-200 group-hover:border-primary/55">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {movie.posterUrl ? (
            <Image
              src={movie.posterUrl}
              alt={`${movie.title} artwork`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none"
            />
          ) : <div className="grid h-full place-items-center text-sm text-muted-foreground">Artwork unavailable</div>}
          <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" aria-hidden="true" />
          <span className={`absolute bottom-4 left-4 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md ${bookable ? "border-primary/40 bg-primary/20 text-white" : "border-white/20 bg-black/55 text-white/85"}`}>
            {bookable ? "Showtimes available" : hasShowtimes ? "Sold out" : "No showtimes scheduled"}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{movie.genre.slice(0, 2).join(" / ") || "Movie"}</p>
          <h3 className="mb-3 text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary">{movie.title}</h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {movie.duration > 0 && <span className="inline-flex items-center gap-1.5"><Clock3 className="size-4" aria-hidden="true" />{formatRuntime(movie.duration)}</span>}
            {movie.rating > 0 && <span>Rating {movie.rating.toFixed(1)}/10</span>}
          </div>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
            <span className="text-muted-foreground">{bookable ? `${movie.availableShowtimeCount} ${movie.availableShowtimeCount === 1 ? "screening" : "screenings"} with seats` : "Explore film details"}</span>
            <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-foreground group-hover:text-primary">View film <ArrowUpRight className="size-4" aria-hidden="true" /></span>
          </div>
        </div>
      </article>
    </Link>
  );
}
