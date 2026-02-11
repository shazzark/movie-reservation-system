//types/movie.ts

export type Movie = {
  _id: string; // MongoDB uses _id
  title: string;
  description: string;
  genre: string[];
  duration: number; // in minutes
  rating: number;
  posterUrl: string;
  releaseDate: string | Date;
  director: string; // Added this for your frontend
  seatsAvailable: number;
  isActive: boolean;
  cast: string[];
  createdAt: Date;
};

export type MovieInput = Omit<Movie, "_id" | "createdAt">;
