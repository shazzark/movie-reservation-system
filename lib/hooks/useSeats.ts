// import type { Seat } from "@/lib/types";

import { useQuery } from "@tanstack/react-query";
import api from "../api";
import type { Seat } from "../../types/seat";

export const useSeatsByShowtime = (showtimeId: string | undefined) => {
  return useQuery<Seat[], Error>({
    queryKey: ["seats", showtimeId],
    queryFn: async () => {
      if (!showtimeId) return [];

      const data = await api.showtimes.getById(showtimeId);
      const bookedSeats = data.showtime.bookedSeats || [];

      // Generate the grid (8 rows, 12 seats)
      const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
      const seats: Seat[] = [];

      rows.forEach((rowLabel) => {
        for (let i = 1; i <= 12; i++) {
          const seatId = `${rowLabel}${i}`;
          seats.push({
            id: seatId,
            showtimeId: showtimeId,
            row: rowLabel,
            seatNumber: i,
            isAvailable: !bookedSeats.includes(seatId),
            type: "regular",
          });
        }
      });

      return seats;
    },
    enabled: !!showtimeId,
  });
};
