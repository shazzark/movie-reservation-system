// types/booking.ts
export interface Booking {
  _id: string;
  userId: string;
  movieId: string;
  showtimeId: string;
  theaterId: string;
  seats: string[]; // Storing seat IDs like ["A1", "A2"]
  totalPrice: number;
  bookingDate: string;
  showtimeStartTime?: string | null;
  status: "confirmed" | "cancelled" | "pending";
}

export interface CreateBookingDto {
  showtimeId: string;
  seats: string[];
}

export interface BookingDetails extends Booking {
  movie: { title: string; genre: string[]; duration: number } | null;
  showtime: { startTime: string; price: number; format: string } | null;
  theater: { name: string; location: string } | null;
}
