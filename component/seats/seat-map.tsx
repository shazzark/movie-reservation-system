"use client";

import { useMemo } from "react";
import type { Seat } from "../../lib/types";
import { SeatButton } from "./seats-button";
import { motion } from "framer-motion";

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: Seat[];
  onSeatToggle: (seat: Seat) => void;
}

export function SeatMap({ seats, selectedSeats, onSeatToggle }: SeatMapProps) {
  const seatsByRow = useMemo(() => {
    const rows = new Map<string, Seat[]>();
    seats.forEach((seat) => {
      if (!rows.has(seat.row)) {
        rows.set(seat.row, []);
      }
      rows.get(seat.row)!.push(seat);
    });
    // Sort by row letter
    return Array.from(rows.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [seats]);

  const selectedIds = new Set(selectedSeats.map((s) => s.id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Screen */}
      <div className="text-center">
        <div className="mx-auto w-4/5 h-1 bg-linear-to-r from-transparent via-foreground to-transparent mb-8 rounded-full" />
        <p className="text-sm font-semibold text-muted-foreground">SCREEN</p>
      </div>

      {/* Seats */}
      <div className="space-y-4">
        {seatsByRow.map(([row, rowSeats]) => (
          <motion.div
            key={row}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            {/* Row Label */}
            <span className="w-6 text-center font-bold text-foreground text-sm">
              {row}
            </span>

            {/* Seats */}
            <div className="flex flex-wrap gap-2 justify-center">
              {rowSeats.map((seat, idx) => (
                <SeatButton
                  key={seat.id}
                  seat={seat}
                  isSelected={selectedIds.has(seat.id)}
                  onClick={() => {
                    if (seat.isAvailable) {
                      onSeatToggle(seat);
                    }
                  }}
                />
              ))}
            </div>

            {/* Row Label (Right) */}
            <span className="w-6 text-center font-bold text-foreground text-sm">
              {row}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 justify-center pt-8 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-green-500/20 border border-green-500/50" />
          <span className="text-xs text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-accent" />
          <span className="text-xs text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-muted opacity-50" />
          <span className="text-xs text-muted-foreground">Booked</span>
        </div>
      </div>
    </motion.div>
  );
}
