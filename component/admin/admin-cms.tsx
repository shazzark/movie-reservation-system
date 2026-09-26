"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, CalendarClock, Search, Ticket } from "lucide-react";
import { Card } from "@/component/ui/card";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { adminApi, ApiRequestError, bookingApi, theaterApi } from "@/lib/api";
import { useMovies } from "@/lib/hooks/useMovie";
import type { Theater } from "@/types/theater";
import type { AdminShowtime } from "@/lib/api";

const errorMessage = (error: unknown) => error instanceof ApiRequestError ? error.message : error instanceof Error ? error.message : "The request failed.";
const localDateTime = (value?: string) => value ? new Date(new Date(value).getTime() - new Date(value).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "";

export function AdminTheaters() {
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["theaters"], queryFn: theaterApi.getAll });
  const [editing, setEditing] = useState<Theater | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""); const [location, setLocation] = useState("");
  const [rows, setRows] = useState("8"); const [seatsPerRow, setSeatsPerRow] = useState("12");
  const [search, setSearch] = useState(""); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  const reset = () => { setOpen(false); setEditing(null); setName(""); setLocation(""); setRows("8"); setSeatsPerRow("12"); setError(""); };
  const refreshTheaterData = async () => Promise.all([
    client.invalidateQueries({ queryKey: ["theaters"] }),
    client.invalidateQueries({ queryKey: ["admin-overview"] }),
    client.invalidateQueries({ queryKey: ["admin-showtimes"] }),
    client.invalidateQueries({ queryKey: ["showtimes"] }),
    client.invalidateQueries({ queryKey: ["discovery-movies"] }),
  ]);
  const save = useMutation({
    mutationFn: () => {
      const r = Number(rows); const s = Number(seatsPerRow);
      if (!Number.isInteger(r) || r < 1 || !Number.isInteger(s) || s < 1 || r > 40 || s > 40) throw new Error("Rows and seats per row must be whole numbers from 1 to 40.");
      const body = { name: name.trim(), location: location.trim(), rows: r, seatsPerRow: s };
      if (!body.name || !body.location) throw new Error("Name and location are required.");
      return editing ? theaterApi.update(editing._id, body) : theaterApi.create(body);
    },
    onSuccess: async () => { await refreshTheaterData(); setMessage(editing ? "Theater updated." : "Theater created."); reset(); },
    onError: (err) => setError(errorMessage(err)),
  });
  const remove = useMutation({ mutationFn: theaterApi.delete, onSuccess: async () => { await refreshTheaterData(); setMessage("Theater deleted."); }, onError: (err) => setError(errorMessage(err)) });
  const edit = (theater: Theater) => { setEditing(theater); setName(theater.name); setLocation(theater.location); setRows(String(theater.rows)); setSeatsPerRow(String(theater.seatsPerRow)); setOpen(true); setError(""); setMessage(""); };
  const filtered = (query.data ?? []).filter((theater) => `${theater.name} ${theater.location}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Locations</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Theaters</h1><p className="mt-2 text-sm text-muted-foreground">Manage theater details and seat layouts used by showtimes.</p></div><Button onClick={() => { reset(); setOpen(true); }}>Add theater</Button></header>
    {message && <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</p>}
    {error && !open && <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
    {open && <Card className="border-border bg-card p-5"><h2 className="mb-4 text-lg font-semibold">{editing ? "Edit theater" : "Create theater"}</h2>{error && <p role="alert" className="mb-3 text-sm text-destructive">{error}</p>}<form className="grid gap-3 sm:grid-cols-2" onSubmit={(event: FormEvent) => { event.preventDefault(); setError(""); save.mutate(); }}>
      <label className="space-y-1 text-sm">Theater name<Input value={name} onChange={(event) => setName(event.target.value)} required /></label><label className="space-y-1 text-sm">Location<Input value={location} onChange={(event) => setLocation(event.target.value)} required /></label>
      <label className="space-y-1 text-sm">Rows<Input type="number" min="1" max="40" value={rows} onChange={(event) => setRows(event.target.value)} required /></label><label className="space-y-1 text-sm">Seats per row<Input type="number" min="1" max="40" value={seatsPerRow} onChange={(event) => setSeatsPerRow(event.target.value)} required /></label>
      <p className="text-xs text-muted-foreground sm:col-span-2">Capacity is derived as {Number(rows || 0) * Number(seatsPerRow || 0)} seats. A theater’s layout cannot change after a showtime references it.</p><div className="flex gap-2 sm:col-span-2"><Button disabled={save.isPending}>{save.isPending ? "Saving…" : editing ? "Save theater" : "Create theater"}</Button><Button type="button" variant="outline" onClick={reset}>Cancel</Button></div>
    </form></Card>}
    <div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="Search theaters" className="pl-10" placeholder="Search theaters" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
    {query.isLoading ? <Card className="p-8 text-sm text-muted-foreground">Loading theaters…</Card> : query.error ? <Card role="alert" className="p-6 text-sm text-destructive">Could not load theaters: {errorMessage(query.error)}</Card> : filtered.length === 0 ? <Card className="p-8 text-center text-sm text-muted-foreground">{query.data?.length ? "No theaters match this search." : "No theaters have been created."}</Card> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((theater) => <Card key={theater._id} className="border-border bg-card p-5"><div className="flex items-start justify-between"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Building2 className="size-5" /></span><span className="text-sm font-semibold tabular-nums">{theater.totalSeats} seats</span></div><h2 className="mt-4 text-lg font-semibold">{theater.name}</h2><p className="mt-1 text-sm text-muted-foreground">{theater.location}</p><p className="mt-3 text-sm text-muted-foreground">{theater.rows} rows × {theater.seatsPerRow} seats</p><div className="mt-4 flex gap-2"><Button variant="outline" size="sm" onClick={() => edit(theater)}>Edit</Button><Button variant="ghost" size="sm" disabled={remove.isPending} onClick={() => { if (window.confirm(`Delete ${theater.name}? The API will prevent deletion if showtimes or reservations reference it.`)) remove.mutate(theater._id); }}>{remove.isPending ? "Deleting…" : "Delete if unused"}</Button></div></Card>)}</div>}
  </div>;
}

export function AdminShowtimes() {
  const client = useQueryClient();
  const showtimes = useQuery({ queryKey: ["admin-showtimes"], queryFn: adminApi.showtimes });
  const movies = useMovies(); const theaters = useQuery({ queryKey: ["theaters"], queryFn: theaterApi.getAll });
  const [editing, setEditing] = useState<AdminShowtime | null>(null); const [open, setOpen] = useState(false);
  const [movieId, setMovieId] = useState(""); const [theaterId, setTheaterId] = useState(""); const [startTime, setStartTime] = useState(""); const [price, setPrice] = useState(""); const [format, setFormat] = useState("2D");
  const [search, setSearch] = useState(""); const [error, setError] = useState(""); const [message, setMessage] = useState("");
  const reset = () => { setOpen(false); setEditing(null); setMovieId(""); setTheaterId(""); setStartTime(""); setPrice(""); setFormat("2D"); setError(""); };
  const save = useMutation({
    mutationFn: () => {
      const parsedPrice = Number(price);
      if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) throw new Error("Price must be a positive number.");
      if (!startTime || new Date(startTime) <= new Date()) throw new Error("Choose a future showtime.");
      if (editing) return adminApi.updateShowtime(editing._id, { startTime, price: parsedPrice, format: format.trim() });
      if (!movieId || !theaterId) throw new Error("Choose a movie and a theater.");
      return adminApi.createShowtime({ movieId, theaterId, startTime, price: parsedPrice, format: format.trim() });
    },
    onSuccess: async () => { await Promise.all([client.invalidateQueries({ queryKey: ["admin-showtimes"] }), client.invalidateQueries({ queryKey: ["admin-overview"] }), client.invalidateQueries({ queryKey: ["showtimes"] }), client.invalidateQueries({ queryKey: ["discovery-movies"] })]); setMessage(editing ? "Showtime updated." : "Showtime created."); reset(); },
    onError: (err) => setError(errorMessage(err)),
  });
  const remove = useMutation({ mutationFn: adminApi.deleteShowtime, onSuccess: async () => { await Promise.all([client.invalidateQueries({ queryKey: ["admin-showtimes"] }), client.invalidateQueries({ queryKey: ["admin-overview"] }), client.invalidateQueries({ queryKey: ["showtimes"] }), client.invalidateQueries({ queryKey: ["discovery-movies"] })]); setMessage("Showtime removed."); }, onError: (err) => setError(errorMessage(err)) });
  const edit = (item: AdminShowtime) => { setEditing(item); setStartTime(localDateTime(item.startTime)); setPrice(String(item.price)); setFormat(item.format); setOpen(true); setError(""); setMessage(""); };
  const filtered = (showtimes.data ?? []).filter((item) => `${item.movie?.title ?? ""} ${item.theater?.name ?? ""} ${item.format}`.toLowerCase().includes(search.toLowerCase()));
  const availableMovies = (movies.data ?? []).filter((movie) => movie.isActive);

  return <div className="space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Schedule & pricing</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Showtimes</h1><p className="mt-2 text-sm text-muted-foreground">Create screenings from existing active movies and theater layouts.</p></div><Button onClick={() => { reset(); setOpen(true); }}>Add showtime</Button></header>
    {message && <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</p>}{error && !open && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {open && <Card className="border-border bg-card p-5"><h2 className="mb-4 text-lg font-semibold">{editing ? "Edit showtime" : "Create showtime"}</h2>{error && <p role="alert" className="mb-3 text-sm text-destructive">{error}</p>}<form className="grid gap-3 sm:grid-cols-2" onSubmit={(event: FormEvent) => { event.preventDefault(); setError(""); save.mutate(); }}>
      {!editing && <><label className="space-y-1 text-sm">Movie<select className="h-10 w-full rounded-md border border-input bg-background px-3" value={movieId} onChange={(event) => setMovieId(event.target.value)} required><option value="">Select active movie</option>{availableMovies.map((movie) => <option key={movie._id} value={movie._id}>{movie.title}</option>)}</select></label><label className="space-y-1 text-sm">Theater<select className="h-10 w-full rounded-md border border-input bg-background px-3" value={theaterId} onChange={(event) => setTheaterId(event.target.value)} required><option value="">Select theater</option>{(theaters.data ?? []).map((theater) => <option key={theater._id} value={theater._id}>{theater.name} · {theater.location}</option>)}</select></label></>}
      <label className="space-y-1 text-sm">Date and time<Input type="datetime-local" value={startTime} onChange={(event) => setStartTime(event.target.value)} required disabled={!!editing && editing.bookedCount > 0} /><span className="block text-xs text-muted-foreground">{editing?.bookedCount ? "Schedule locked because reservations exist." : "Must be in the future."}</span></label>
      <label className="space-y-1 text-sm">Ticket price<Input type="number" min="0.01" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} required /></label><label className="space-y-1 text-sm">Format<Input value={format} onChange={(event) => setFormat(event.target.value)} required /></label>
      {!editing && movieId && theaterId && <p className="text-xs text-muted-foreground sm:col-span-2">Capacity is calculated from the selected theater’s seat layout.</p>}
      <div className="flex gap-2 sm:col-span-2"><Button disabled={save.isPending || movies.isLoading || theaters.isLoading || !!movies.error || !!theaters.error}>{save.isPending ? "Saving…" : editing ? "Save changes" : "Create showtime"}</Button><Button type="button" variant="outline" onClick={reset}>Cancel</Button></div>
    </form></Card>}
    <div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="Search showtimes by movie or theater" className="pl-10" placeholder="Search movie or theater" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
    {(movies.error || theaters.error) && !showtimes.error && <p role="alert" className="text-sm text-destructive">Could not load movie or theater options: {errorMessage(movies.error ?? theaters.error)}</p>}
    {showtimes.isLoading ? <Card className="p-8 text-sm text-muted-foreground">Loading showtimes…</Card> : showtimes.error ? <Card role="alert" className="p-6 text-sm text-destructive">Could not load showtimes: {errorMessage(showtimes.error)}</Card> : !filtered.length ? <Card className="p-8 text-center text-sm text-muted-foreground">{showtimes.data?.length ? "No showtimes match this search." : "No showtimes have been created."}</Card> : <div className="space-y-3">{filtered.map((item) => { const past = new Date(item.startTime) <= new Date(); const full = item.bookedCount >= item.totalSeats; const status = past ? "Past" : full ? "Sold out" : "Upcoming"; return <Card key={item._id} className="border-border bg-card p-4"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex items-center gap-2"><CalendarClock className="size-4 text-primary" /><h2 className="font-semibold">{item.movie?.title ?? "Movie unavailable"}</h2><span className={`rounded-full px-2 py-0.5 text-xs ${past ? "bg-muted text-muted-foreground" : full ? "bg-amber-500/10 text-amber-300" : "bg-emerald-500/10 text-emerald-300"}`}>{status}</span></div><p className="mt-1 text-sm text-muted-foreground">{item.theater?.name ?? "Theater unavailable"} · {item.theater?.location ?? ""}</p><p className="mt-1 text-sm text-muted-foreground">{new Date(item.startTime).toLocaleString()} · {item.format} · ${item.price.toFixed(2)}</p></div><div className="flex items-center justify-between gap-3 sm:justify-end"><p className="flex items-center gap-1.5 text-sm text-muted-foreground"><Ticket className="size-4" />{item.bookedCount}/{item.totalSeats}</p><Button size="sm" variant="outline" disabled={past} onClick={() => edit(item)}>Edit</Button><Button size="sm" variant="ghost" disabled={past || remove.isPending} onClick={() => { if (window.confirm("Remove this future showtime? Showtimes with reservation records cannot be removed.")) remove.mutate(item._id); }}>{remove.isPending ? "Removing…" : "Remove if unused"}</Button></div></div>{editing?._id === item._id && item.bookedCount > 0 && <p className="mt-3 text-xs text-muted-foreground">Existing reservations lock the date and time. Price and format can still be changed for future reservations.</p>}</Card>; })}</div>}
  </div>;
}

export function AdminReservations() {
  const client = useQueryClient(); const query = useQuery({ queryKey: ["admin-reservations"], queryFn: adminApi.reservations });
  const [search, setSearch] = useState(""); const [status, setStatus] = useState("all"); const [error, setError] = useState(""); const [message, setMessage] = useState("");
  const cancel = useMutation({ mutationFn: bookingApi.delete, onSuccess: async () => { await Promise.all([client.invalidateQueries({ queryKey: ["admin-reservations"] }), client.invalidateQueries({ queryKey: ["admin-showtimes"] }), client.invalidateQueries({ queryKey: ["admin-overview"] })]); setMessage("Reservation cancelled and seats released."); }, onError: (err) => setError(errorMessage(err)) });
  const filtered = useMemo(() => (query.data ?? []).filter((booking) => (status === "all" || booking.status === status) && `${booking._id} ${booking.customer.name} ${booking.customer.email} ${booking.movie?.title ?? ""}`.toLowerCase().includes(search.toLowerCase())), [query.data, search, status]);
  return <div className="space-y-6">
    <header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Customer activity</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Reservations</h1><p className="mt-2 text-sm text-muted-foreground">Inspect saved reservations. Cancellation follows the same seat-release transaction as the customer flow.</p></header>
    {message && <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</p>}{error && <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
    <div className="grid gap-3 sm:grid-cols-[1fr_180px]"><div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="Search reservations by reference, customer, or movie" className="pl-10" placeholder="Search reference, customer or movie" value={search} onChange={(event) => setSearch(event.target.value)} /></div><select aria-label="Filter reservations by status" className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option><option value="pending">Pending</option></select></div>
    {query.isLoading ? <Card className="p-8 text-sm text-muted-foreground">Loading reservations…</Card> : query.error ? <Card role="alert" className="p-6 text-sm text-destructive">Could not load reservations: {errorMessage(query.error)}</Card> : !filtered.length ? <Card className="p-8 text-center text-sm text-muted-foreground">No reservations match this filter.</Card> : <div className="space-y-3">{filtered.map((booking) => { const future = !!booking.showtime && new Date(booking.showtime.startTime) > new Date(); const canCancel = booking.status === "confirmed" && future; return <Card key={booking._id} className="border-border bg-card p-4 sm:p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs text-muted-foreground">{booking._id}</span><span className={`rounded-full px-2.5 py-1 text-xs ${booking.status === "confirmed" ? "bg-emerald-500/10 text-emerald-300" : booking.status === "cancelled" ? "bg-muted text-muted-foreground" : "bg-amber-500/10 text-amber-300"}`}>{booking.status}</span></div><h2 className="mt-2 font-semibold">{booking.movie?.title ?? "Movie record unavailable"}</h2><p className="mt-1 text-sm text-muted-foreground">{booking.theater?.name ?? "Theater unavailable"}{booking.theater?.location ? ` · ${booking.theater.location}` : ""}</p><p className="mt-1 text-sm text-muted-foreground">{booking.showtime ? new Date(booking.showtime.startTime).toLocaleString() : "Showtime unavailable"} · Seats {booking.seats.join(", ")}</p><p className="mt-2 text-sm">Customer: <span className="text-muted-foreground">{booking.customer.name} · {booking.customer.email}</span></p></div><div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end"><div className="text-left lg:text-right"><p className="font-semibold">${booking.totalPrice.toFixed(2)}</p><p className="text-xs text-muted-foreground">Reservation value · {new Date(booking.bookingDate).toLocaleDateString()}</p></div>{canCancel && <Button size="sm" variant="outline" disabled={cancel.isPending} onClick={() => { if (window.confirm("Cancel this reservation and release its seats?")) cancel.mutate(booking._id); }}>Cancel reservation</Button>}</div></div></Card>; })}</div>}
  </div>;
}
