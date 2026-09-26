// lib/api.ts
import { signIn, signOut, SignInResponse } from "next-auth/react";
import { MovieInput } from "../types/movie";
import type { Theater } from "../types/theater";

import type { Booking, BookingDetails, CreateBookingDto } from "../types/booking";
import type { ShowtimeDetails } from "../types/showtime";
import type { TmdbMovieDraft, TmdbSearchResult } from "@/types/tmdb";

/**
 * Define specific interfaces instead of 'any'
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Example user interface for your data fields
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
  bookingCount?: number;
}

export interface AdminShowtime {
  _id: string;
  movieId: string;
  theaterId: string;
  startTime: string;
  price: number;
  format: string;
  totalSeats: number;
  bookedSeats: string[];
  bookedCount: number;
  movie: { title: string; isActive: boolean; posterUrl?: string } | null;
  theater: { name: string; location: string; rows: number; seatsPerRow: number; totalSeats: number } | null;
}

export interface AdminReservation {
  _id: string;
  seats: string[];
  totalPrice: number;
  status: "confirmed" | "cancelled" | "pending";
  bookingDate: string;
  movie: { title: string; posterUrl?: string } | null;
  showtime: { startTime: string; format: string } | null;
  theater: { name: string; location: string } | null;
  customer: { name: string; email: string };
}

export class ApiRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "ApiRequestError";
  }
}

/**
 * Base fetcher using generics <T> to avoid 'any'
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = (await response.json()) as T;

  if (!response.ok) {
    const errorData = data as { error?: string };
    throw new ApiRequestError(errorData.error || "API Request failed", response.status);
  }

  return data;
}

export const authApi = {
  // Returns a Promise<SignInResponse | undefined>
  login: async (
    email: string,
    password: string,
    callbackUrl = "/",
  ): Promise<SignInResponse | undefined> => {
    return await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
  },

  signup: async (
    userData: Record<string, unknown>,
  ): Promise<ApiResponse<UserData>> => {
    return apiFetch<ApiResponse<UserData>>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  logout: async (): Promise<void> => {
    await signOut({ callbackUrl: "/" });
  },

  // ✅ Fetch all users
  getUsers: async (): Promise<UserData[]> => {
    return apiFetch<UserData[]>("/users"); // Use internal apiFetch
  },

};

export const movieApi = {
  getAll: () => apiFetch<import("../types/movie").Movie[]>("/movies"),

  getById: async (id: string) => {
    return apiFetch<import("../types/movie").Movie>(`/movies/${id}`);
  },

  // Added CRUD methods for admin
  create: async (movie: MovieInput) => {
    return apiFetch<import("../types/movie").Movie>("/movies", {
      method: "POST",
      body: JSON.stringify(movie),
    });
  },

  update: async (id: string, movie: Partial<MovieInput>) => {
    return apiFetch<import("../types/movie").Movie>(`/movies/${id}`, {
      method: "PUT",
      body: JSON.stringify(movie),
    });
  },

  delete: async (id: string) => {
    return apiFetch<{ message: string }>(`/movies/${id}`, {
      method: "DELETE",
    });
  },
};

export const tmdbApi = {
  search: (query: string) => apiFetch<TmdbSearchResult[]>(`/admin/tmdb/search?query=${encodeURIComponent(query)}`),
  details: (tmdbId: number) => apiFetch<TmdbMovieDraft>(`/admin/tmdb/${tmdbId}`),
};

export const adminApi = {
  overview: () => apiFetch<{
    activeMovies: number; upcomingShowtimes: number; users: number; theaters: number;
    upcomingReservations: number; reservedSeats: number;
    nextShowtimes: Array<{ _id: string; startTime: string; price: number; movieTitle: string; theaterName: string; bookedCount: number; totalSeats: number }>;
  }>("/admin/overview"),
  showtimes: () => apiFetch<AdminShowtime[]>("/admin/showtimes"),
  createShowtime: (data: { movieId: string; theaterId: string; startTime: string; price: number; format: string }) =>
    apiFetch<AdminShowtime>("/admin/showtimes", { method: "POST", body: JSON.stringify(data) }),
  updateShowtime: (id: string, data: Partial<Pick<AdminShowtime, "startTime" | "price" | "format">>) =>
    apiFetch<AdminShowtime>(`/admin/showtimes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteShowtime: (id: string) => apiFetch<{ message: string }>(`/admin/showtimes/${id}`, { method: "DELETE" }),
  reservations: () => apiFetch<AdminReservation[]>("/admin/reservations"),
};

export const uploadApi = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    // ✅ Note: We use window.fetch directly here, NOT apiFetch
    // because apiFetch is hardcoded to use "application/json"
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      // ❌ DO NOT set Content-Type header here;
      // browser needs to set it to multipart/form-data automatically
    });

    if (!res.ok) throw new Error("Image upload failed");
    return res.json();
  },
};

export const showtimeApi = {
  getById: (id: string) => apiFetch<ShowtimeDetails>(`/showtimes/${id}`),

  // Get all showtimes for a specific movie
  getByMovieId: async (movieId: string) => {
    const res = await fetch(`/api/showtimes?movieId=${movieId}`);
    if (!res.ok) throw new Error("Failed to fetch showtimes for this movie");
    return res.json();
  },
};

export const theaterApi = {
  // READ ALL
  getAll: async () => {
    return apiFetch<Theater[]>("/theaters");
  },

  // READ ONE
  getById: async (id: string) => {
    return apiFetch<Theater>(`/theaters/${id}`);
  },

  // CREATE
  create: async (data: Pick<Theater, "name" | "location" | "rows" | "seatsPerRow">) => {
    return apiFetch<Theater>("/theaters", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // UPDATE (New)
  update: async (id: string, data: Partial<Pick<Theater, "name" | "location" | "rows" | "seatsPerRow">>) => {
    return apiFetch<Theater>(`/theaters/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // DELETE (New)
  delete: async (id: string) => {
    return apiFetch<{ message: string }>(`/theaters/${id}`, {
      method: "DELETE",
    });
  },
};

export const bookingApi = {
  createBooking: (data: CreateBookingDto) =>
    apiFetch<ApiResponse<Booking>>("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getById: (id: string) => apiFetch<ApiResponse<BookingDetails>>(`/bookings/${id}`),

  getUserBookings: () => apiFetch<ApiResponse<Booking[]>>("/bookings/user"), // ✅ type fixed

  delete: (id: string) =>
    apiFetch<ApiResponse<Booking>>(`/bookings/${id}`, {
      method: "DELETE",
    }),
};

const api = {
  auth: authApi,
  movies: movieApi,
  booking: bookingApi,
  upload: uploadApi,
  showtimes: showtimeApi,
  theaters: theaterApi,
};

export default api;
/**
//  * Default export for the API module
//  */
// const api = {
//   auth: authApi,
//   movies: moviesApi,
//   booking: bookingApi,
//   fetch: apiFetch,
//   getAuthHeaders,
// };

// export default api;
