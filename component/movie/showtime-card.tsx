"use client";

import { Card } from "../../component/ui/card";
import { Badge } from "../../component/ui/badge";
import type { Showtime } from "../../types/showtime";
import { Armchair } from "lucide-react";
import { motion } from "framer-motion";

interface ShowtimeCardProps {
  showtime: Showtime;
  theaterName: string;
  isSelected?: boolean;
  onSelect?: () => void;
  index?: number;
}

export function ShowtimeCard({
  showtime,
  theaterName,
  isSelected = false,
  onSelect,
  index = 0,
}: ShowtimeCardProps) {
  const startDate = new Date(showtime.startTime);
  const startHour = startDate.getHours();
  const startMinutes = String(startDate.getMinutes()).padStart(2, "0");

  // ✅ Calculate availability from the bookedSeats array
  const bookedCount = showtime.bookedSeats?.length || 0;
  const availableSeats = showtime.totalSeats - bookedCount;
  const occupancyPercent = Math.round(
    (bookedCount / showtime.totalSeats) * 100,
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={onSelect}
      className="cursor-pointer"
    >
      <Card
        className={`p-5 transition-all hover:shadow-lg ${
          isSelected ? "border-accent border-2 bg-accent/5" : "border-border"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-foreground">
                {String(startHour).padStart(2, "0")}:{startMinutes}
              </span>
              <Badge variant="outline" className="hidden sm:inline">
                {theaterName}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground sm:hidden">
              {theaterName}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-end">
            <div className="flex-1 sm:flex-none sm:w-32">
              <div className="flex items-center gap-2 mb-1">
                <Armchair className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold text-foreground">
                  {availableSeats} available
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${100 - occupancyPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {occupancyPercent}% booked
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">Price per seat</p>
              <p className="text-2xl font-bold text-accent">
                {/* ✅ Changed from pricePerSeat to price */}${showtime.price}
              </p>
            </div>
          </div>
        </div>

        {isSelected && (
          <motion.div
            layoutId="selectedShowtime"
            className="mt-3 flex items-center gap-2 text-accent text-sm font-semibold"
          >
            <div className="h-2 w-2 rounded-full bg-accent" />
            Selected
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
