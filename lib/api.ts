// lib/api.ts
import { signIn, signOut, SignInResponse } from "next-auth/react";
import { MovieInput } from "../types/movie";
import type { Theater } from "../types/theater";

import type { Booking } from "../types/booking";

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
    throw new Error(errorData.error || "API Request failed");
  }

  return data;
}

export const authApi = {
  // Returns a Promise<SignInResponse | undefined>
  login: async (
    email: string,
    password: string,
  ): Promise<SignInResponse | undefined> => {
    return await signIn("credentials", {
      email,
      password,
      redirect: false,
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

  forgotPassword: async (
    email: string,
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiFetch<ApiResponse<{ message: string }>>("/auth/forgot", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  logout: async (): Promise<void> => {
    await signOut({ callbackUrl: "/" });
  },

  // ✅ Fetch all users
  getUsers: async (): Promise<UserData[]> => {
    return apiFetch<UserData[]>("/users"); // Use internal apiFetch
  },

  // ✅ Delete a user
  deleteUser: async (id: string) => {
    return apiFetch<{ message: string }>(`/users/${id}`, { method: "DELETE" });
  },
};

export const movieApi = {
  getAll: async () => {
    const res = await fetch("/api/movies");
    if (!res.ok) throw new Error("Failed to fetch movies");
    return res.json();
  },

  getById: async (id: string) => {
    const res = await fetch(`/api/movies/${id}`);
    if (!res.ok) throw new Error("Movie not found");
    return res.json();
  },

  // Added CRUD methods for admin
  create: async (movie: MovieInput) => {
    const res = await fetch("/api/movies", {
      method: "POST",
      body: JSON.stringify(movie),
    });
    return res.json();
  },

  update: async (id: string, movie: Partial<MovieInput>) => {
    const res = await fetch(`/api/movies/${id}`, {
      method: "PUT",
      body: JSON.stringify(movie),
    });
    return res.json();
  },

  delete: async (id: string) => {
    const res = await fetch(`/api/movies/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
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
  // Get details for a specific showtime (including booked seats)
  getById: async (id: string) => {
    const res = await fetch(`/api/showtimes/${id}`);
    if (!res.ok) throw new Error("Showtime not found");
    return res.json();
  },

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
  create: async (data: Partial<Theater>) => {
    return apiFetch<ApiResponse<Theater>>("/theaters", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // UPDATE (New)
  update: async (id: string, data: Partial<Theater>) => {
    return apiFetch<ApiResponse<Theater>>(`/theaters/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // DELETE (New)
  delete: async (id: string) => {
    return apiFetch<ApiResponse<{ message: string }>>(`/theaters/${id}`, {
      method: "DELETE",
    });
  },
};

export const bookingApi = {
  createBooking: (data: Record<string, unknown>) =>
    apiFetch<ApiResponse<unknown>>("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getUserBookings: () => apiFetch<ApiResponse<Booking[]>>("/bookings/user"), // ✅ type fixed

  delete: (id: string) =>
    apiFetch<ApiResponse<{ message: string }>>(`/bookings/${id}`, {
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
