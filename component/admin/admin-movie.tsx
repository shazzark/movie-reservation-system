"use client";

import Image from "next/image";
import { type FormEvent, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, Plus, Search, Upload, X } from "lucide-react";
import { Button } from "@/component/ui/button";
import { Card } from "@/component/ui/card";
import { Input } from "@/component/ui/input";
import { useMovies } from "@/lib/hooks/useMovie";
import { ApiRequestError, movieApi, tmdbApi, uploadApi } from "@/lib/api";
import type { Movie, MovieInput } from "@/types/movie";
import type { TmdbMovieDraft, TmdbSearchResult } from "@/types/tmdb";

type FormValues = {
  title: string;
  description: string;
  genre: string;
  duration: string;
  rating: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  director: string;
  seatsAvailable: string;
  cast: string;
  isActive: boolean;
};

const blank: FormValues = {
  title: "", description: "", genre: "", duration: "", rating: "0", posterUrl: "",
  backdropUrl: "", releaseDate: "", director: "", seatsAvailable: "0", cast: "", isActive: true,
};

const errorText = (error: unknown) => error instanceof ApiRequestError
  ? error.message
  : error instanceof Error ? error.message : "The request failed.";

function asDateInput(value: string | Date | undefined) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

export function AdminMovies() {
  const queryClient = useQueryClient();
  const { data: movies = [], isLoading, error } = useMovies();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Movie | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [values, setValues] = useState<FormValues>(blank);
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [tmdbOpen, setTmdbOpen] = useState(false);
  const [tmdbQuery, setTmdbQuery] = useState("");
  const [tmdbResults, setTmdbResults] = useState<TmdbSearchResult[]>([]);
  const [tmdbSearched, setTmdbSearched] = useState(false);
  const [tmdbSearchLoading, setTmdbSearchLoading] = useState(false);
  const [tmdbDetailsLoading, setTmdbDetailsLoading] = useState<number | null>(null);
  const [tmdbError, setTmdbError] = useState("");
  const [selectedTmdb, setSelectedTmdb] = useState<TmdbMovieDraft | null>(null);

  const saveMutation = useMutation({
    mutationFn: (input: MovieInput) => editing ? movieApi.update(editing._id, input) : movieApi.create(input),
    onSuccess: async (_movie, input) => {
      if (input.tmdbId) {
        setTmdbResults((current) => current.map((result) => result.tmdbId === input.tmdbId ? { ...result, alreadyImported: true } : result));
      }
      const successMessage = input.tmdbId ? "Movie imported into CineBook." : editing ? "Movie changes saved." : "Movie created.";
      setEditing(null);
      setSelectedTmdb(null);
      setFormOpen(false);
      setValues(blank);
      setFormError("");
      setNotice(successMessage);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["movies"] }),
        queryClient.invalidateQueries({ queryKey: ["discovery-movies"] }),
      ]);
    },
    onError: (err, input) => {
      setFormError(errorText(err));
      if (err instanceof ApiRequestError && err.status === 409 && input.tmdbId) {
        setTmdbResults((current) => current.map((result) => result.tmdbId === input.tmdbId ? { ...result, alreadyImported: true } : result));
        setSelectedTmdb((current) => current && current.tmdbId === input.tmdbId ? { ...current, alreadyImported: true } : current);
        void queryClient.invalidateQueries({ queryKey: ["movies"] });
      }
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ movie, isActive }: { movie: Movie; isActive: boolean }) => movieApi.update(movie._id, { isActive }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["movies"] }),
        queryClient.invalidateQueries({ queryKey: ["discovery-movies"] }),
      ]);
      setNotice("Movie status updated.");
    },
    onError: (err) => setFormError(errorText(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => movieApi.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["movies"] });
      setNotice("Movie deleted.");
    },
    onError: (err) => setFormError(errorText(err)),
  });

  const filtered = useMemo(
    () => movies.filter((movie) => `${movie.title} ${movie.genre.join(" ")}`.toLowerCase().includes(search.toLowerCase())),
    [movies, search],
  );

  const createManually = () => {
    setEditing(null);
    setSelectedTmdb(null);
    setFormOpen(true);
    setValues(blank);
    setFormError("");
    setNotice("");
  };

  const beginEdit = (movie: Movie) => {
    if (saveMutation.isPending || tmdbDetailsLoading !== null) return;
    setEditing(movie);
    setSelectedTmdb(null);
    setFormOpen(true);
    setFormError("");
    setNotice("");
    setValues({
      title: movie.title,
      description: movie.description,
      genre: movie.genre.join(", "),
      duration: String(movie.duration),
      rating: String(movie.rating),
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl ?? "",
      releaseDate: asDateInput(movie.releaseDate),
      director: movie.director,
      seatsAvailable: String(movie.seatsAvailable),
      cast: movie.cast.join(", "),
      isActive: movie.isActive,
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setSelectedTmdb(null);
    setFormOpen(false);
    setValues(blank);
    setFormError("");
  };

  const searchTmdb = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (tmdbSearchLoading || saveMutation.isPending || tmdbDetailsLoading !== null) return;
    const query = tmdbQuery.trim();
    if (query.length < 2) {
      setTmdbError("Enter at least two characters to search TMDB.");
      setTmdbResults([]);
      setTmdbSearched(false);
      return;
    }
    setTmdbSearchLoading(true);
    setTmdbError("");
    setTmdbSearched(true);
    setTmdbResults([]);
    try {
      setTmdbResults(await tmdbApi.search(query));
    } catch (err) {
      setTmdbError(errorText(err));
    } finally {
      setTmdbSearchLoading(false);
    }
  };

  const chooseTmdbMovie = async (result: TmdbSearchResult) => {
    if (result.alreadyImported) return;
    setTmdbDetailsLoading(result.tmdbId);
    setTmdbError("");
    try {
      const draft = await tmdbApi.details(result.tmdbId);
      if (draft.alreadyImported) {
        setTmdbError("This TMDB movie has already been imported into CineBook.");
        setTmdbResults((current) => current.map((item) => item.tmdbId === result.tmdbId ? { ...item, alreadyImported: true } : item));
        return;
      }
      setEditing(null);
      setSelectedTmdb(draft);
      setFormOpen(true);
      setFormError("");
      setNotice("");
      setValues({
        title: draft.title,
        description: draft.description,
        genre: draft.genre.join(", "),
        duration: draft.duration ? String(draft.duration) : "",
        rating: String(draft.rating),
        posterUrl: draft.posterUrl,
        backdropUrl: draft.backdropUrl ?? "",
        releaseDate: draft.releaseDate,
        director: draft.director,
        seatsAvailable: "0",
        cast: draft.cast.join(", "),
        isActive: true,
      });
    } catch (err) {
      setTmdbError(errorText(err));
    } finally {
      setTmdbDetailsLoading(null);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saveMutation.isPending || tmdbSearchLoading || tmdbDetailsLoading !== null || selectedTmdb?.alreadyImported) return;
    setFormError("");
    setNotice("");
    const duration = Number(values.duration);
    const rating = Number(values.rating);
    const seatsAvailable = Number(values.seatsAvailable);
    if (!values.title.trim() || !values.description.trim() || !values.director.trim() || !values.posterUrl.trim() || !values.releaseDate || !values.genre.trim()) {
      setFormError("Complete the required fields. TMDB fields missing from its record need to be filled in before import.");
      return;
    }
    if (!Number.isInteger(duration) || duration < 1 || !Number.isFinite(rating) || rating < 0 || rating > 10 || !Number.isInteger(seatsAvailable) || seatsAvailable < 0) {
      setFormError("Check duration, rating (0–10), and seats available.");
      return;
    }
    const input: MovieInput = {
      title: values.title.trim(),
      description: values.description.trim(),
      genre: values.genre.split(",").map((item) => item.trim()).filter(Boolean),
      duration,
      rating,
      posterUrl: values.posterUrl.trim(),
      releaseDate: new Date(`${values.releaseDate}T12:00:00`),
      director: values.director.trim(),
      seatsAvailable,
      cast: values.cast.split(",").map((item) => item.trim()).filter(Boolean),
      isActive: values.isActive,
      ...(selectedTmdb ? { tmdbId: selectedTmdb.tmdbId } : {}),
      backdropUrl: values.backdropUrl.trim(),
    };
    if (!input.genre.length || !/^https?:\/\//i.test(input.posterUrl) || (input.backdropUrl && !/^https?:\/\//i.test(input.backdropUrl))) {
      setFormError("Add at least one genre and valid image URLs.");
      return;
    }
    saveMutation.mutate(input);
  };

  const uploadPoster = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setFormError("");
    setNotice("");
    try {
      const result = await uploadApi.uploadImage(file);
      setValues((current) => ({ ...current, posterUrl: result.url }));
      setNotice("Poster uploaded. Save the movie to apply it.");
    } catch (err) {
      setFormError(errorText(err));
    } finally {
      setUploading(false);
    }
  };

  return <div className="space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Catalog</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Movies</h1>
        <p className="mt-2 text-sm text-muted-foreground">Manage movie information and customer availability.</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" disabled={saveMutation.isPending || tmdbDetailsLoading !== null} onClick={() => { setTmdbOpen((open) => !open); setFormOpen(false); setTmdbError(""); }}>
          Import from TMDB
        </Button>
        <Button onClick={createManually} disabled={saveMutation.isPending || tmdbDetailsLoading !== null} className="gap-2"><Plus className="size-4" /> Create manually</Button>
      </div>
    </header>

    {notice && <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{notice}</p>}
    {formError && !formOpen && <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{formError}</p>}

    {tmdbOpen && <Card className="space-y-4 border-border bg-card p-5 sm:p-6">
      <div>
        <h2 className="text-xl font-semibold">Search TMDB</h2>
        <p className="mt-1 text-sm text-muted-foreground">Search results are not saved to CineBook until you review and import a movie.</p>
      </div>
      <form onSubmit={(event) => void searchTmdb(event)} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="tmdb-movie-search" className="sr-only">Search TMDB movies</label>
        <Input id="tmdb-movie-search" value={tmdbQuery} onChange={(event) => setTmdbQuery(event.target.value)} placeholder="Search by movie title" maxLength={120} />
        <Button type="submit" disabled={tmdbSearchLoading || saveMutation.isPending || tmdbDetailsLoading !== null || tmdbQuery.trim().length < 2}>
          {tmdbSearchLoading ? "Searching…" : <><Search className="mr-2 size-4" /> Search</>}
        </Button>
      </form>
      {tmdbError && <p role="alert" className="text-sm text-destructive">{tmdbError}</p>}
      {tmdbSearchLoading && <p role="status" aria-live="polite" className="text-sm text-muted-foreground">Searching TMDB…</p>}
      {!tmdbSearchLoading && tmdbSearched && !tmdbError && tmdbResults.length === 0 && <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">No matching movies were found.</p>}
      {tmdbResults.length > 0 && <div className="grid gap-3 md:grid-cols-2">
        {tmdbResults.map((result) => <article key={result.tmdbId} className="flex min-w-0 gap-3 rounded-xl border border-border p-3">
          <div className="relative h-28 w-[4.5rem] shrink-0 overflow-hidden rounded-md bg-muted">
            {result.posterUrl
              ? <Image src={result.posterUrl} alt={`${result.title} poster`} fill unoptimized sizes="72px" className="object-cover" />
              : <span className="grid h-full place-items-center px-1 text-center text-[10px] text-muted-foreground">No poster</span>}
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start">
            <h3 className="font-semibold">{result.title}</h3>
            <p className="text-xs text-muted-foreground">{result.releaseDate.slice(0, 4) || "Release date unavailable"}</p>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{result.overview || "No overview available."}</p>
            <Button
              size="sm"
              variant={result.alreadyImported ? "secondary" : "outline"}
              className="mt-2"
              disabled={!!result.alreadyImported || tmdbDetailsLoading !== null || saveMutation.isPending}
              onClick={() => void chooseTmdbMovie(result)}
            >
              {result.alreadyImported ? "Already imported" : tmdbDetailsLoading === result.tmdbId ? "Loading details…" : "Review movie"}
            </Button>
          </div>
        </article>)}
      </div>}
    </Card>}

    {formOpen && <Card className="border-border bg-card p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{editing ? `Edit ${editing.title}` : selectedTmdb ? `Review ${selectedTmdb.title}` : "New movie"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{selectedTmdb ? `Review and edit this TMDB record before importing it. TMDB ID ${selectedTmdb.tmdbId}.` : "Fields follow CineBook’s current movie model."}</p>
        </div>
        <Button variant="ghost" size="icon" disabled={saveMutation.isPending} onClick={cancelEdit} aria-label="Close movie form"><X className="size-4" /></Button>
      </div>
      {selectedTmdb && <p className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">CineBook saves this as a regular movie record. Required fields missing from TMDB must be completed below.</p>}
      {formError && <p role="alert" className="mb-4 text-sm text-destructive">{formError}</p>}
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm">Title<Input value={values.title} onChange={(event) => setValues({ ...values, title: event.target.value })} required /></label>
        <label className="space-y-1.5 text-sm">Director<Input value={values.director} onChange={(event) => setValues({ ...values, director: event.target.value })} required /></label>
        <label className="space-y-1.5 text-sm">Genres <span className="text-muted-foreground">(comma separated)</span><Input value={values.genre} onChange={(event) => setValues({ ...values, genre: event.target.value })} placeholder="Drama, Thriller" required /></label>
        <label className="space-y-1.5 text-sm">Cast <span className="text-muted-foreground">(comma separated)</span><Input value={values.cast} onChange={(event) => setValues({ ...values, cast: event.target.value })} placeholder="Actor names" /></label>
        <label className="space-y-1.5 text-sm">Duration (minutes)<Input type="number" min="1" value={values.duration} onChange={(event) => setValues({ ...values, duration: event.target.value })} required /></label>
        <label className="space-y-1.5 text-sm">Stored rating (0–10)<Input type="number" min="0" max="10" step="any" value={values.rating} onChange={(event) => setValues({ ...values, rating: event.target.value })} required /></label>
        <label className="space-y-1.5 text-sm">Release date<Input type="date" value={values.releaseDate} onChange={(event) => setValues({ ...values, releaseDate: event.target.value })} required /></label>
        <label className="space-y-1.5 text-sm">Legacy movie seat count<Input type="number" min="0" value={values.seatsAvailable} onChange={(event) => setValues({ ...values, seatsAvailable: event.target.value })} required /><span className="block text-xs text-muted-foreground">Reservation capacity comes from the theater/showtime layout.</span></label>
        <label className="space-y-1.5 text-sm sm:col-span-2">Description<textarea className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={values.description} onChange={(event) => setValues({ ...values, description: event.target.value })} required /></label>
        <div className="space-y-3 sm:col-span-2">
          <label className="space-y-1.5 text-sm">Poster URL<Input type="url" value={values.posterUrl} onChange={(event) => setValues({ ...values, posterUrl: event.target.value })} required /></label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted"><Upload className="size-4" />{uploading ? "Uploading…" : "Upload poster image"}<input type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="sr-only" disabled={uploading} onChange={(event) => { void uploadPoster(event.target.files?.[0]); event.currentTarget.value = ""; }} /></label>
          {values.posterUrl && <Image src={values.posterUrl} alt="Poster preview" width={100} height={145} unoptimized className="rounded-md object-cover" />}
          <label className="block space-y-1.5 text-sm">Backdrop URL (optional)<Input type="url" value={values.backdropUrl} onChange={(event) => setValues({ ...values, backdropUrl: event.target.value })} /><span className="block text-xs text-muted-foreground">Leave empty to use the poster as the movie artwork.</span></label>
          {values.backdropUrl && <Image src={values.backdropUrl} alt="Backdrop preview" width={240} height={135} unoptimized className="rounded-md object-cover" />}
        </div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={values.isActive} onChange={(event) => setValues({ ...values, isActive: event.target.checked })} /> Active and available in customer discovery</label>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <Button type="submit" disabled={saveMutation.isPending || uploading || tmdbSearchLoading || tmdbDetailsLoading !== null || !!selectedTmdb?.alreadyImported}>{saveMutation.isPending ? "Saving…" : selectedTmdb?.alreadyImported ? "Already imported" : editing ? "Save changes" : selectedTmdb ? "Import movie into CineBook" : "Create movie"}</Button>
          <Button type="button" variant="outline" disabled={saveMutation.isPending} onClick={cancelEdit}>Cancel</Button>
        </div>
      </form>
    </Card>}

    <div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="Search movies by title or genre" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title or genre" className="pl-10" /></div>
    {isLoading ? <Card className="p-8 text-sm text-muted-foreground">Loading movies…</Card> : error ? <Card role="alert" className="p-6 text-sm text-destructive">Could not load movies: {error.message}</Card> : filtered.length === 0 ? <Card className="p-8 text-center text-sm text-muted-foreground">{movies.length ? "No movies match this search." : "No movies have been created yet."}</Card> : <div className="grid gap-4 xl:grid-cols-2">
      {filtered.map((movie) => <Card key={movie._id} className="flex gap-4 border-border bg-card p-4">
        <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-lg bg-muted"><Image src={movie.posterUrl} alt="" fill unoptimized className="object-cover" /></div>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="font-semibold">{movie.title}</h2><p className="mt-1 text-xs text-muted-foreground">{movie.genre.join(" · ")} · {movie.duration} min</p>{movie.tmdbId && <p className="mt-1 text-xs text-muted-foreground">Imported from TMDB</p>}</div><span className={`rounded-full px-2.5 py-1 text-xs ${movie.isActive ? "bg-emerald-500/10 text-emerald-300" : "bg-muted text-muted-foreground"}`}>{movie.isActive ? "Active" : "Inactive"}</span></div>
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{movie.description}</p>
          <div className="mt-4 flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => beginEdit(movie)}><Edit2 className="mr-1.5 size-3.5" /> Edit</Button><Button size="sm" variant="outline" disabled={toggleMutation.isPending} onClick={() => toggleMutation.mutate({ movie, isActive: !movie.isActive })}>{movie.isActive ? "Deactivate" : "Activate"}</Button><Button size="sm" variant="ghost" disabled={deleteMutation.isPending} onClick={() => { if (window.confirm(`Permanently delete ${movie.title}? This only succeeds when no showtimes or reservations refer to it.`)) deleteMutation.mutate(movie._id); }}>Delete if unused</Button></div>
        </div>
      </Card>)}
    </div>}
  </div>;
}
