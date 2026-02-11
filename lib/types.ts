export interface Movie {
  id: string;
  title: string;
  genre: string[];
  description: string;
  posterUrl: string;
  rating: number;
  duration: number; // in minutes
  releaseDate: string;
  director: string;
  cast: string[];
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  totalSeats: number;
  rows: number;
  seatsPerRow: number;
}

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  pricePerSeat: number;
  availableSeats: number;
  totalSeats: number;
}

export interface Seat {
  id: string;
  showtimeId: string;
  row: string;
  seatNumber: number;
  isAvailable: boolean;
  isSelected?: boolean;
  type: "regular" | "premium" | "disabled";
}

export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  showtimeId: string;
  theaterId: string;
  seats: Seat[];
  totalPrice: number;
  bookingDate: string; // ISO 8601 format
  status: "confirmed" | "cancelled" | "pending";
  paymentStatus: "pending" | "completed" | "failed";
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bookings: Booking[];
  createdAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
