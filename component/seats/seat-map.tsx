"use client";

import { useMemo } from "react";
import type { Seat } from "../../types/seat";
import { SeatButton } from "./seats-button";

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: Seat[];
  onSeatToggle: (seat: Seat) => void;
}

export function SeatMap({ seats, selectedSeats, onSeatToggle }: SeatMapProps) {
  const seatsByRow = useMemo(() => {
    const rows = new Map<string, Seat[]>();
    for (const seat of seats) {
      const rowSeats = rows.get(seat.row) ?? [];
      rowSeats.push(seat);
      rows.set(seat.row, rowSeats);
    }
    return [...rows.entries()];
  }, [seats]);
  const selectedIds = new Set(selectedSeats.map((seat) => seat.id));

  return (
    <div className="space-y-7">
      <div className="mx-auto max-w-3xl px-4 text-center" aria-hidden="true">
        <div className="h-1.5 rounded-full bg-linear-to-r from-transparent via-primary/75 to-transparent shadow-[0_5px_26px_rgba(243,81,112,0.12)]" />
        <p className="mt-3 text-[11px] font-bold tracking-[0.28em] text-muted-foreground">SCREEN</p>
      </div>

      <div
        className="overflow-x-auto rounded-xl border border-border/70 bg-background/35 px-3 py-5 sm:px-5"
        tabIndex={0}
        role="region"
        aria-label="Theater seats. Scroll horizontally to see all seats."
      >
        <div className="mx-auto w-max min-w-full space-y-3">
          {seatsByRow.map(([row, rowSeats]) => (
            <div key={row} className="flex w-max min-w-full items-center justify-center gap-2.5 sm:gap-3">
              <span className="w-7 shrink-0 text-center text-xs font-bold text-muted-foreground">{row}</span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {rowSeats.map((seat) => (
                  <SeatButton
                    key={seat.id}
                    seat={seat}
                    isSelected={selectedIds.has(seat.id)}
                    onClick={() => onSeatToggle(seat)}
                  />
                ))}
              </div>
              <span className="w-7 shrink-0 text-center text-xs font-bold text-muted-foreground">{row}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3" aria-label="Seat legend">
        {[
          ["bg-emerald-400/15 border-emerald-400/50", "Available"],
          ["bg-primary border-primary", "Selected"],
          ["bg-muted border-border", "Occupied"],
        ].map(([style, label]) => (
          <div key={label} className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <span className={`size-4 rounded-t-md rounded-b-sm border ${style}`} aria-hidden="true" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
