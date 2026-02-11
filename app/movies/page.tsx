import type { Metadata } from "next";
import { Navigation } from "../../component/navigation";
import { Footer } from "../../component/footer";
import { MoviesClient } from "../../component/movies/movie-client";
// @/components/movies/movies-client
export const metadata: Metadata = {
  title: "All Movies - CineBook",
  description: "Browse all available movies and book your tickets online",
};

export default function MoviesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <MoviesClient />
      <Footer />
    </div>
  );
}
