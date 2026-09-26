"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, Search, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/component/ui/avartar";
import { Card } from "@/component/ui/card";
import { Input } from "@/component/ui/input";
import api, { UserData } from "@/lib/api";

export function AdminUsers() {
  const [search, setSearch] = useState("");
  const query = useQuery<UserData[], Error>({ queryKey: ["users"], queryFn: api.auth.getUsers });
  const filtered = useMemo(() => (query.data ?? []).filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(search.toLowerCase())), [query.data, search]);
  const admins = (query.data ?? []).filter((user) => user.role === "admin").length;
  return <div className="space-y-6">
    <header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Accounts</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Users</h1><p className="mt-2 text-sm text-muted-foreground">Read-only account directory. Role changes and deletion are outside this demo’s admin scope.</p></header>
    <div className="grid gap-3 sm:grid-cols-2"><Card className="flex items-center gap-4 border-border bg-card p-4"><Users className="size-5 text-primary" /><div><p className="text-xs text-muted-foreground">Accounts</p><p className="text-xl font-semibold">{query.data?.length ?? (query.isLoading ? "…" : "—")}</p></div></Card><Card className="flex items-center gap-4 border-border bg-card p-4"><span className="size-2 rounded-full bg-emerald-400" /><div><p className="text-xs text-muted-foreground">Administrators</p><p className="text-xl font-semibold">{query.data ? admins : query.isLoading ? "…" : "—"}</p></div></Card></div>
    <div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="Search users by name, email, or role" className="pl-10" placeholder="Search name, email or role" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
    {query.isLoading ? <Card className="p-8 text-sm text-muted-foreground">Loading accounts…</Card> : query.error ? <Card role="alert" className="p-6 text-sm text-destructive">Could not load users: {query.error.message}</Card> : !filtered.length ? <Card className="p-8 text-center text-sm text-muted-foreground">No accounts match this search.</Card> : <div className="grid gap-3 md:grid-cols-2">{filtered.map((user) => <Card key={user.id} className="flex min-w-0 items-center gap-3 border-border bg-card p-4"><Avatar><AvatarFallback className="bg-primary/10 text-primary">{user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "U"}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><p className="truncate font-medium">{user.name || "Unnamed account"}</p><p className="flex items-center gap-1 truncate text-xs text-muted-foreground"><Mail className="size-3 shrink-0" />{user.email}</p><p className="mt-1 text-xs text-muted-foreground">{user.bookingCount ?? 0} reservation{user.bookingCount === 1 ? "" : "s"} · Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "date unavailable"}</p></div><span className={`rounded-full px-2.5 py-1 text-xs ${user.role === "admin" ? "bg-emerald-500/10 text-emerald-300" : "bg-muted text-muted-foreground"}`}>{user.role}</span></Card>)}</div>}
  </div>;
}
