import type { DiscoveryShowtime } from "@/types/discovery";

export function ShowtimeCard({
  showtime,
  selected,
  onSelect,
}: {
  showtime: DiscoveryShowtime;
  selected: boolean;
  onSelect: () => void;
}) {
  const soldOut = showtime.availableSeats <= 0;
  const time = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(showtime.startTime));

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${time}, ${showtime.theaterName}, $${showtime.price.toFixed(2)} per seat${soldOut ? ", sold out" : `, ${showtime.availableSeats} seats available`}`}
      disabled={soldOut}
      onClick={onSelect}
      className={`min-w-[150px] rounded-xl border px-4 py-4 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${selected ? "border-primary bg-primary/10 text-foreground" : soldOut ? "cursor-not-allowed border-border bg-background/45 text-muted-foreground opacity-65" : "border-border bg-background/75 text-foreground hover:border-primary/60 hover:bg-secondary"}`}
    >
      <span className="block text-lg font-bold leading-none">{time}</span>
      <span className="mt-2 block text-xs font-medium text-muted-foreground">{showtime.format} · ${showtime.price.toFixed(2)}</span>
      <span className={`mt-3 block text-xs font-semibold ${selected ? "text-primary" : "text-muted-foreground"}`}>{soldOut ? "Sold out" : selected ? "Selected" : `${showtime.availableSeats} seats left`}</span>
    </button>
  );
}
