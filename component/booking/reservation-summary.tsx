import Image from "next/image";
import { CalendarDays, MapPin, Ticket } from "lucide-react";

export interface ReservationSummaryProps {
  movieTitle: string;
  posterUrl?: string;
  theaterName: string;
  theaterLocation: string;
  startsAt: Date | string;
  seats: string[];
  pricePerSeat: number;
}

export function ReservationSummary({
  movieTitle,
  posterUrl,
  theaterName,
  theaterLocation,
  startsAt,
  seats,
  pricePerSeat,
}: ReservationSummaryProps) {
  const start = new Date(startsAt);
  const estimatedTotal = seats.length * pricePerSeat;

  return (
    <div>
      <div className="flex items-center gap-4 border-b border-border pb-5">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
          {posterUrl ? <Image src={posterUrl} alt={`${movieTitle} poster`} fill sizes="64px" className="object-cover" /> : null}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Reservation</p>
          <h2 className="mt-1 truncate text-lg font-bold text-foreground">{movieTitle}</h2>
        </div>
      </div>

      <dl className="space-y-4 py-5 text-sm">
        <div className="flex gap-3">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <div><dt className="text-xs text-muted-foreground">Theater</dt><dd className="mt-0.5 font-semibold text-foreground">{theaterName}</dd><dd className="text-muted-foreground">{theaterLocation}</dd></div>
        </div>
        <div className="flex gap-3">
          <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <div><dt className="text-xs text-muted-foreground">Showtime</dt><dd className="mt-0.5 font-semibold text-foreground">{Number.isNaN(start.getTime()) ? "Unavailable" : new Intl.DateTimeFormat(undefined, { weekday: "long", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(start)}</dd></div>
        </div>
        <div className="flex gap-3">
          <Ticket className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <dt className="text-xs text-muted-foreground">Selected seats</dt>
            {seats.length ? <dd className="mt-2 flex flex-wrap gap-1.5">{seats.map((seat) => <span key={seat} className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 font-semibold text-foreground">{seat}</span>)}</dd> : <dd className="mt-1 text-muted-foreground">Choose seats to continue</dd>}
          </div>
        </div>
      </dl>

      <div className="space-y-3 border-t border-border pt-5">
        <div className="flex justify-between gap-4 text-sm text-muted-foreground"><span>{seats.length} {seats.length === 1 ? "ticket" : "tickets"} × ${pricePerSeat.toFixed(2)}</span><span>${estimatedTotal.toFixed(2)}</span></div>
        <div className="flex items-end justify-between gap-4">
          <div><p className="font-semibold text-foreground">Estimated total</p><p className="mt-1 text-xs text-muted-foreground">Final price is confirmed by CineBook</p></div>
          <p className="text-2xl font-bold tracking-tight text-foreground">${estimatedTotal.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
