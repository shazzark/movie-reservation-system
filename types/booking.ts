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
  status: "confirmed" | "cancelled" | "pending";
  paymentStatus: "pending" | "completed" | "failed";
}

export interface CreateBookingDto {
  userId: string;
  movieId: string;
  showtimeId: string;
  theaterId: string;
  seats: string[];
  totalPrice: number;
}
