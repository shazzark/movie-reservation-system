import type { Metadata } from "next";
import { CustomerShell } from "@/component/layout/customer-shell";
import { MoviesClient } from "../../component/movies/movie-client";
// @/components/movies/movies-client
export const metadata: Metadata = {
  title: "All Movies - CineBook",
  description: "Browse all available movies and book your tickets online",
};

export default function MoviesPage() {
  return (
    <CustomerShell>
      <MoviesClient />
    </CustomerShell>
  );
}
