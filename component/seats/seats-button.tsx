"use client";

import { motion } from "framer-motion";
import type { Seat } from "../../types/seat";
import { cn } from "../../lib/utils";

interface SeatButtonProps {
  seat: Seat;
  isSelected: boolean;
  onClick: () => void;
}

export function SeatButton({ seat, isSelected, onClick }: SeatButtonProps) {
  const getButtonStyle = () => {
    if (!seat.isAvailable) {
      return "bg-muted cursor-not-allowed opacity-50";
    }
    if (isSelected) {
      return "bg-accent text-accent-foreground";
    }
    return "bg-green-500/20 border-green-500/50 hover:bg-green-500/30 cursor-pointer";
  };

  return (
    <motion.button
      whileHover={seat.isAvailable && !isSelected ? { scale: 1.1 } : {}}
      whileTap={seat.isAvailable ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={!seat.isAvailable}
      className={cn(
        "h-10 w-10 rounded-sm border border-border text-xs font-semibold transition-all",
        getButtonStyle(),
      )}
      title={`${seat.row}${seat.seatNumber} - ${
        !seat.isAvailable ? "Booked" : isSelected ? "Selected" : "Available"
      }`}
    >
      <span className="hidden sm:inline">{seat.seatNumber}</span>
      <span className="sm:hidden">{seat.seatNumber}</span>
    </motion.button>
  );
}
