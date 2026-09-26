import type { Metadata } from "next";
import mongoose from "mongoose";
import { CustomerShell } from "@/component/layout/customer-shell";
import { MovieDetailsClient } from "@/component/movie/movie-detail";
import { handleDbConnection } from "@/lib/dbHandler";
import { getMovieById } from "@/services/movie.service";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) return { title: "Movie - CineBook" };
  try {
    await handleDbConnection();
    const movie = await getMovieById(id);
    return movie
      ? { title: `${movie.title} - CineBook`, description: movie.description }
      : { title: "Movie - CineBook" };
  } catch {
    return { title: "Movie - CineBook" };
  }
}

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params;
  return (
    <CustomerShell>
      <MovieDetailsClient movieId={id} />
    </CustomerShell>
  );
}
