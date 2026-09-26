"use client";

import type { Seat } from "../../types/seat";
import { cn } from "../../lib/utils";

interface SeatButtonProps {
  seat: Seat;
  isSelected: boolean;
  onClick: () => void;
}

export function SeatButton({ seat, isSelected, onClick }: SeatButtonProps) {
  const state = !seat.isAvailable ? "occupied" : isSelected ? "selected" : "available";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!seat.isAvailable}
      aria-label={`Seat ${seat.id}, ${state}`}
      aria-pressed={isSelected}
      title={`Seat ${seat.id} · ${state}`}
      className={cn(
        "size-10 shrink-0 rounded-t-lg rounded-b-sm border text-xs font-semibold transition-colors sm:size-11",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
        !seat.isAvailable && "cursor-not-allowed border-border bg-muted text-muted-foreground/60",
        seat.isAvailable && !isSelected && "border-emerald-400/50 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/25",
        isSelected && "border-primary bg-primary text-primary-foreground shadow-[0_0_0_2px_rgba(243,81,112,0.18)]",
      )}
    >
      {seat.seatNumber}
    </button>
  );
}
