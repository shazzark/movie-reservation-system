export type TmdbSearchResult = {
  tmdbId: number;
  title: string;
  overview: string;
  releaseDate: string;
  posterUrl: string | null;
  alreadyImported?: boolean;
};

export type TmdbMovieDraft = {
  tmdbId: number;
  title: string;
  description: string;
  genre: string[];
  duration: number | null;
  rating: number;
  posterUrl: string;
  backdropUrl?: string;
  releaseDate: string;
  director: string;
  cast: string[];
  alreadyImported: boolean;
};
