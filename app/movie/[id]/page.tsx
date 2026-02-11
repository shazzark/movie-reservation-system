// movie/[id]/page.tsx
import type { Metadata } from "next";
import { Navigation } from "../../../component/navigation";
import { Footer } from "../../../component/footer";
import { MovieDetailsClient } from "../../../component/movie/movie-detail";
import { movies } from "../../../lib/mockData";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getMovieMetadata(id: string) {
  const movie = movies.find((m) => m.id === id);
  return movie;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieMetadata(id);

  return {
    title: movie ? `${movie.title} - CineBook` : "Movie - CineBook",
    description: movie
      ? movie.description
      : "Book your movie tickets with CineBook",
  };
}

export async function generateStaticParams() {
  return movies.map((movie) => ({
    id: movie.id,
  }));
}

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <MovieDetailsClient movieId={id} />
      </main>
      <Footer />
    </div>
  );
}
