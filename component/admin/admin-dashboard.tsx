"use client";

import { useQuery } from "@tanstack/react-query";
import { Film, Clapperboard, Users, Building2, Ticket, Armchair } from "lucide-react";
import { Card } from "@/component/ui/card";
import { adminApi } from "@/lib/api";

const metricIcons = [Film, Clapperboard, Ticket, Users, Building2, Armchair];

export function AdminDashboard() {
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-overview"], queryFn: adminApi.overview });
  const metrics = data ? [
    ["Active movies", data.activeMovies],
    ["Upcoming showtimes", data.upcomingShowtimes],
    ["Upcoming reservations", data.upcomingReservations],
    ["Reserved seats", data.reservedSeats],
    ["Registered users", data.users],
    ["Theaters", data.theaters],
  ] as const : [];

  return <div className="space-y-8">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">CineBook Studio</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Overview</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">A current snapshot of the movie catalog and reservation schedule.</p>
    </div>
    {error && <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">Could not load dashboard data: {error.message}</p>}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {isLoading ? Array.from({ length: 6 }, (_, index) => <Card key={index} className="h-28 animate-pulse border-border bg-card" />) : metrics.map(([label, value], index) => {
        const Icon = metricIcons[index];
        return <Card key={label} className="flex items-center gap-4 border-border bg-card p-5">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span>
          <div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold tabular-nums">{value.toLocaleString()}</p></div>
        </Card>;
      })}
    </div>
    <section>
      <div className="mb-4"><h2 className="text-xl font-semibold">Next showtimes</h2><p className="mt-1 text-sm text-muted-foreground">Upcoming screenings currently saved in CineBook.</p></div>
      <Card className="divide-y divide-border border-border bg-card">
        {isLoading ? <div className="p-6 text-sm text-muted-foreground">Loading schedule…</div> : !data?.nextShowtimes.length ? <div className="p-8 text-center text-sm text-muted-foreground">No upcoming showtimes are scheduled.</div> : data.nextShowtimes.map((item) => <div key={item._id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="font-medium">{item.movieTitle}</p><p className="text-sm text-muted-foreground">{item.theaterName} · {new Date(item.startTime).toLocaleString()}</p></div>
          <p className="text-sm text-muted-foreground">{item.bookedCount} / {item.totalSeats} seats reserved</p>
        </div>)}
      </Card>
      <p className="mt-3 text-xs text-muted-foreground">Reservation totals are not payment or revenue figures.</p>
    </section>
  </div>;
}
